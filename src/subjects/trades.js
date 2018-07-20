import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { Trade } from '../classes/index';

class TradeSubject {
  constructor(context) {
    this.tradesInternalId = [];
    this.observer = Subscriber.create(
      insObject => {
        this.tradesInternalId.push(insObject.instrumentId);
        context.SubscribeTrades({
          instrumentId: insObject.instrumentId,
          History: insObject.history
        });
      },
      error => console.log(error),
      () => console.log('complete')
    );
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'TradeDataUpdateEvent').subscribe(x => {
        const l = JSON.parse(x.o);
        l.forEach(x => obs.next(new Trade(x)));
      });
      return () => {
        context.trades.tradesInternalId.forEach(x =>
          context.UnSubscribeTrades({ InstrumentId: x })
        );
      };
    });
    const sub = Subject.create(this.observer, this.observable);
    sub.tradesInternalId = this.tradesInternalId;
    return sub;
  }
}

export default TradeSubject;
