import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

class AccountEventsSubject {
  constructor(context) {
    this.observer = Subscriber.create(
      x => {},
      error => console.log(error),
      () => console.log('complete')
    );
    this.observable = Observable.create(obs => {
      context.ws.filter(x => x.n === 'AccountEvent').subscribe(x => {
        obs.next(x);
      });
    });
    let sub = Subject.create(this.observer, this.observable);
    return sub;
  }
}

export default AccountEventsSubject;
