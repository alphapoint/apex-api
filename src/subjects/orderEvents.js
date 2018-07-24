import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { Order } from '../classes';

class OrderEventSubject {
  constructor(context) {
    this.observer = Subscriber.create(
      () => {},
      error => console.log(error),
      () => console.log('complete')
    );
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'OrderStateEvent').subscribe(x => {
        const l = JSON.parse(x.o);
        obs.next(new Order(l));
      });
    });
    const sub = Subject.create(this.observer, this.observable);
    return sub;
  }
}

export default OrderEventSubject;
