# APEX-API

This library is a useful tool for interacting with Alphapoint's JSON-RPC over WS API. It simulates a request/response type of flow, even though the messages are all stateless. This library is a UMD build, which means that it can be used via ES6 Imports, script tag in the browser, or using CommonJS Require.

## Installation

To install this library, first you will need to have nodejs installed, then you will need your .npmrc file to be configured to point at our private npm repo (Nexus). Lastly, you can install this package globally so it will always be available. If you want to use it on a case by case basis, you can add the .npmrc file to an individual package, and install it locally.

To install it, use the commands below, adding -g if you want to install globally

```bash
npm install (-g) apex-api
```

## Usages

To use this library, you simply create a new instance of the APEX class, as follows

Node

```javascript
const { APEX } = require('apex-api');
const apex = new APEX(url, options);
```

Browser

```html
<script src='apex-api.min.js'>
<script>
const APEX = alphapoint.APEX
const apex = new APEX(url, options)
</script>
```

ES6 Import

```javascript
import { APEX } from 'apex-api';
const apex = new APEX(url, options);
```

The options object looks like this, is optional (using the default values below) and should be pretty self-explanatory. The default callback is useful for when you mainly just want to log output of your commands.

```javascript
{
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      defaultCallback: () => {},
      debug: false
    }
```

Once you have instantiated the library, you can make any call to the APEX server using three different patterns.

### Using Callbacks

```javascript
apex.RPCCall(<command>, <params>, <callback>)
```

### Using Promises

```javascript
apex.RPCPromise(<command>, <params>).then(result=>result).catch(error=>error)
```

### Using Async/Await (Preferred Method)

```javascript
try {
  const result = await apex.RPCPromise(<command>, <params>)
  console.log(result)

} catch (err) {
  console.log(error)
}
```

### Convenience Functions

The library also creates some convenience functions for commonly used RPC commands. Usage looks as follows. The convenience functions all return a promise.

`apex.<Command>(<params>)`

Example

```javascript
const result = await apex.Ping()
```

### Subscriptions

In order to receive streaming data (for example order book information), this library uses observables.

Once you have sent a command to the server to request updates, you can then `subscribe` to the Observables for regular updates.

Example:

```javascript
// I am setting up a handler for any updates
apex.Level1.subscribe(console.log)
// Now I am sending my request to subscribe to the APEX server
const result = await apex.SubscribeLevel1({OMSId: 1, InstrumentId: 1})
```

While there are a few specialized Observables, they are all getting the data from the WebSocket Observable which can be found at `apex.ws`

This means that you can create custom Observables of your own as follows:

```javascript
apex.ws
  .filter(msg => msg.n === 'NewOrderRejectEvent')
  .map(({ Price, Quantity }) => {
    Price, Quantity;
  })
  .subscribe(handlerFunction);
```

### Notes

To enable async/await using the Node REPL, run node with the flag `--experimental-repl-await`


[![asciicast](https://asciinema.org/a/q9Et8PVHs7uSGYHSuYMicSDow.svg)](https://asciinema.org/a/q9Et8PVHs7uSGYHSuYMicSDow)
