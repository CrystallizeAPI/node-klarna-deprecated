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

// For production
const client = new KlarnaV2({
  testDrive: false,
  merchantId: 123456, // Obtain from Klarna merchant site
  sharedSecret: "abcdefgh", // Obtain from Klarna merchant site
  storeName: 'mystore.com' // Obtain from Klarna merchant site
});

// If you don't want to use your own merchant
const client = new KlarnaV2({
  testDrive: true,
  useTestMerchant: true
});

// Create order
const { success, order } = client.createOrder(klarnaCheckoutModel);

// Confirm order
const { success } = client.confirmOrder(order.id);

// Capture order
const { success } = client.captureOrder(order.id);

// Transform a Crystallize basket model (from @crystallize/react-basket) to a Klarna model
const klarnaCart = client.crystallizeBasketToKlarnaCart(crystallizeBasket.state);

// Trigger a new recurring order
const { success } = client.createRecurringOrder(options, { recurring_token });

// Get status on a recurring order
const { success } = client.getRecurringOrderStatus(order.id);

```
