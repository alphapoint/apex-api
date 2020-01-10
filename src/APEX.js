const WebSocket = require('universal-websocket-client');
import { webSocket } from 'rxjs/observable/dom/webSocket';
import { endpoints } from './helpers/endpoints';
import Level1 from './classes/Level1';
import Level2 from './classes/Level2';
import Trade from './classes/Trade';
import Order from './classes/Order';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

class APEX {
  constructor(
    url = 'wss://api_apexqa.alphapoint.com/WSGateway/',
    config = {
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      defaultCallback: () => {},
      debug: false
    }
  ) {
    const { onopen, onclose, onerror, defaultCallback, debug } = config;
    this.seq = 0;
    this.callbacks = {};
    this.defaultCallback = defaultCallback;
    this.debug = debug;
    this.ws = webSocket({
      url,
      WebSocketCtor: WebSocket,
      openObserver: {
        next: onopen ? onopen : () => {}
      },
      errorObserver: {
        next: onerror ? onerror : () => {}
      },
      closeObserver: {
        next: onclose ? onclose : () => {}
      }
    });
    this.ws.subscribe(data => {
      if (this.callbacks[data.i]) {
        this.callbacks[data.i](data);
        delete this.callbacks[data.i];
      }
    });
    // Just use observables rather than subjects
    this.Level1 = this.ws
      .filter(x => x.n === 'Level1UpdateEvent')
      .map(({ o }) => {
        return new Level1(JSON.parse(o));
      });
    this.Level2 = this.ws
      .filter(x => x.n === 'Level2UpdateEvent')
      .map(({ o }) => new Level2(JSON.parse(o)));
    this.Trades = this.ws
      .filter(x => x.n === 'TradeDataUpdateEvent')
      .map(({ o }) => new Trade(JSON.parse(o)));
    this.Ticker = this.ws
      .filter(x => x.n === 'TickerDataUpdateEvent')
      .map(({ o }) => JSON.parse(o));
    this.OrderEvents = this.ws
      .filter(x => ['OrderStateEvent'].includes(x.n))
      .map(({ o }) => new Order(JSON.parse(o)));
    this.AccountEvents = this.ws
      .filter(x =>
        [
          'AccountPositionEvent',
          'CancelAllOrdersRejectEvent',
          'CancelOrderRejectEvent',
          'CancelReplaceOrderRejectEvent',
          'MarketStateUpdate',
          'NewOrderRejectEvent',
          'OrderStateEvent',
          'OrderTradeEvent',
          'OrderTradeEvent',
          'PendingDepositUpdate',
          'TransactionEvent'
        ].includes(x.n)
      )
      .map(({ o }) => JSON.parse(o));
  }

  RPCCall(functionName, paramObject, callback = this.defaultCallback) {
    const frame = {
      m: 0,
      i: this.seq,
      n: functionName,
      o: JSON.stringify(paramObject)
    };
    if (this.debug) {
      console.log(`DBG-⬆︎: ${JSON.stringify(frame)}`);
    }
    this.callbacks[this.seq] = callback;
    this.seq += 2;
    this.ws.next(JSON.stringify(frame));
  }

  RPCPromise(command, params) {
    const { debug } = this;
    return new Promise((resolve, reject) => {
      this.RPCCall(command, params, result => {
        if (result.m === 5) {
          if (debug) {
            console.log(`DBG-⬇︎: ${JSON.stringify(result)}`);
          }
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
      const { debug } = this;
      this.RPCCall(endpoint, params, x => {
        if (x.m === 5) {
          if (debug) {
            console.log(`DBG-⬇︎: ${JSON.stringify(x)}`);
          }
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
