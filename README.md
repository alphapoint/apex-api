# Very simple alphapoint API library

Implements rxjs observables for ongoing events, and RPC over WS for "get" requests.

to install:
`npm install alphapoint` (must have .npmrc configured)

example:

```javascript
const { APEX } = require('alphapoint')
const apex = new APEX('wss://api_apexqa.alphapoint.com/WSGateway/')

async function main() {
  try {
    const l2 = await apex.GetL2Snapshot({OMSId: 1, InstrumentId: 2, Depth: 100})
    console.log(l2);
  }
  catch (e) {
    console.log(e);
  }
}

main()
```