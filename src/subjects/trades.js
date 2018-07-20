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
        context.subscribeTrades(
          insObject.instrumentId,
          insObject.history,
          insObject.callback
        );
      },
      error => console.log(error),
      () => console.log('complete')
    );
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'TradeDataUpdateEvent').subscribe(x => {
        const l = JSON.parse(x.o);
        l.forEach(x => obs.next(new Trade(x)));
      });
      return instrumentId => {
        context.trades.tradesInternalId.forEach(x =>
          context.unsubscribeTrades(x)
        );
      };
    });
    let sub = Subject.create(this.observer, this.observable);
    sub.tradesInternalId = this.tradesInternalId;
    return sub;
  }
}

export default TradeSubject;
