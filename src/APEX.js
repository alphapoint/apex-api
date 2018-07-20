const WebSocket = require('universal-websocket-client');
import { webSocket } from 'rxjs/observable/dom/webSocket';
import {
  Level1Subject,
  Level2Subject,
  TradesSubject,
  AccountEventsSubject,
  OrderEventSubject
} from './subjects';

import { endpoints } from './helpers/endpoints';

class APEX {
  constructor(
    url = 'wss://api_apexqa.alphapoint.com/WSGateway/',
    config = {
      onopen: () => {},
      onclose: () => {},
      defaultCallback: msg => console.log(msg)
    }
  ) {
    this.seq = 0;
    this.callbacks = {};
    this.defaultCallback = config.defaultCallback;

    this.ws = webSocket({
      url: url,
      WebSocketCtor: WebSocket,
      openObserver: {
        next: e => config.onopen(e)
      },
      closeObserver: {
        next: e => config.onclose(e)
      }
    });
    this.ws.subscribe(data => {
      if (this.callbacks[data.i]) {
        this.callbacks[data.i](data);
        delete this.callbacks[data.i];
      }
    });

    this.level1 = new Level1Subject(this);
    this.level2 = new Level2Subject(this);
    this.trades = new TradesSubject(this);
    this.accountEvents = new AccountEventsSubject(this);
    this.orderEvents = new OrderEventSubject(this);
  }

  RPCCall(functionName, paramObject, callback = this.defaultCallback) {
    const frame = {
      m: 0,
      i: this.seq,
      n: functionName,
      o: JSON.stringify(paramObject)
    };
    this.callbacks[this.seq] = callback;
    this.seq += 2;
    this.ws.next(JSON.stringify(frame));
  }
  RPCPromise(command, params) {
    return new Promise((resolve, reject) => {
      this.RPCCall(command, params, result => {
        if (result.m === 5) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }
  closeConnection() {
    this.ws.socket.close();
  }
}

endpoints.forEach(endpoint => {
  APEX.prototype[endpoint] = function(
    params = {
      OMSId: 1
    }
  ) {
    return new Promise((resolve, reject) => {
      this.RPCCall(endpoint, { OMSID: 1, ...params }, x => {
        if (x.m === 5) {
          reject(x);
        } else {
          try {
            const y = JSON.parse(x.o);
            resolve(y);
          } catch (e) {
            if (x.o) {
              resolve(x.o);
            } else {
              resolve(x);
            }
          }
        }
      });
    });
  };
});

export { APEX };
