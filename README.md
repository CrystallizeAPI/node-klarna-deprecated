# node-klarna

Node Klarna SDK for [easy Klarna integration in Node.JS](https://crystallize.com/developers/react-components/node-klarna). Generic Klarna Node integration with specific support for the [Crystallize headless ecommerce service](https://crystallize.com/developers).

## Install

```
yarn add @crystallize/node-klarna
```

## Usage V2

https://developers.klarna.com/en/gb/kco-v2

```
const KlarnaV2 = require('@crystallize/node-klarna/v2');

const client = new KlarnaV2({
  testDrive: true,
  merchantId: 200, // Obtain from Klarna merchant site
  sharedSecret: "test", // Obtain from Klarna merchant site
  termsUri: 'https://example.com/terms',
  storeName: 'My store name'
});

// Create order
const { success, order } = client.createOrder(klarnaCheckoutModel);

// Confirm order
const { success } = client.confirmOrder(order.id);

// Capture order
const { success } = client.captureOrder(order.id);

// Transform a Crystallize basket model (from @crystallize/react-basket) to a Klarna model
const klarnaCart = client.crystallizeBasketToKlarnaCart(crystallizeBasket.state);

```
