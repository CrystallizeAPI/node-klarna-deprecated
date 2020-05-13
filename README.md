# node-klarna

Node Klarna SDK for [easy Klarna integration in Node.JS](https://crystallize.com/developers/react-components/node-klarna). Generic Klarna Node integration with specific support for the [Crystallize headless ecommerce service](https://crystallize.com/developers).

Crystallize enables you to build your next-gen e-commerce business by the help of [Fast GraphQL API Service](https://crystallize.com/product/graphql-commerce-api) backed by super structured [Product Information Management (PIM)](https://crystallize.com/product/product-information-management)

## Install

```
yarn add @crystallize/node-klarna
```

## Usage V3

https://developers.klarna.com/api

```
const KlarnaV3 = require('@crystallize/node-klarna/v3');

// Initiate the client
const client = new KlarnaV3({
  testDrive: isProd ? false : true,
  username: '...',
  password: '...'
});

// Create order
const { success, order } = await client.createOrder(klarnaCheckoutModel);

// Confirm order
const { success } = await client.confirmOrder(order.id);

// Acknowledge order
const { success } = await client.acknowledgeOrder(order.id);

// Capture order
const { success } = await client.captureOrder({ orderId: order.id });

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
const { success, order } = await client.createOrder(klarnaCheckoutModel);

// Confirm order
const { success } = await client.confirmOrder(order.id);

// Capture order
const { success } = await client.captureOrder(order.id);

// Transform a Crystallize basket model (from @crystallize/react-basket) to a Klarna model
const klarnaCart = await client.crystallizeBasketToKlarnaCart(crystallizeBasket.state);

// Trigger a new recurring order
const { success } = await client.createRecurringOrder(options, { recurring_token });

// Get status on a recurring order
const { success } = await client.getRecurringOrderStatus(order.id);

```
