import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { Level1 } from '../classes/index';

class Level1Subject {
  constructor(context) {
    this.level1InternalIds = [];
    this.observer = Subscriber.create(
      insObject => {
        this.level1InternalIds.push(insObject.instrumentId);
        context.SubscribeLevel1({ InstrumentId: insObject.instrumentId });
      },
      error => console.log(error),
      () => console.log('complete')
    );
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'Level1UpdateEvent').subscribe(x => {
        const l = JSON.parse(x.o);
        obs.next(new Level1(l));
      });
      return () => {
        context.level1.level1InternalIds.forEach(x =>
          context.UnSubscribeLevel1({ InstrumentId: x })
        );
      };
    });
    const sub = Subject.create(this.observer, this.observable);
    sub.level1InternalIds = this.level1InternalIds;
    return sub;
  }
}

export default Level1Subject;
