import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { Level2 } from '../classes/index';

class Level2Subject {
  constructor(context) {
    this.level2InternalIds = [];

    // Observer
    this.observer = Subscriber.create(
      insObject => {
        this.level2InternalIds.push(insObject.instrumentId);
        context.SubscribeLevel2({
          InstrumentId: insObject.instrumentId,
          Depth: insObject.depth
        });
      },
      error => console.log(error),
      () => console.log('complete')
    );

    // Observable
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'Level2UpdateEvent').subscribe(x => {
        const l = JSON.parse(x.o);
        const orders = l.map(x => new Level2(x));

        obs.next(orders);
      });

      return () => {
        context.level2.level2InternalIds.forEach(x =>
          context.UnSubscribeLevel2({ InstrumentId: x })
        );
      };
    });
    const sub = Subject.create(this.observer, this.observable);
    sub.level2InternalIds = this.level2InternalIds;
    return sub;
  }
}

export default Level2Subject;
