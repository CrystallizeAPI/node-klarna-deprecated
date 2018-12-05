# node-klarna
Node Klarna SDK for [easy Klarna integration in Node.JS](https://crystallize.com/developers/react-components/node-klarna). Generic Klarna Node integration with specific support for the [Crystallize headless ecommerce service](https://crystallize.com/developers).

## Install
```
yarn add @crystallize/node-klarna
```

## Setup
The folling env variables needs to be set
KLARNA_MODE
KLARNA_MERCHANT_ID
KLARNA_SHARED_SECRET
KLARNA_TERMS_URI
KLARNA_STORE_NAME

## Usage V2
https://developers.klarna.com/en/gb/kco-v2

```
const Klarna = require('@crystallize/node-klarna/v2');

// Create order
const { success, order } = Klarna.createOrder(klarnaCheckoutModel);

// Confirm order
const { success } = Klarna.confirmOrder(order.id);

// Capture order
const { success } = Klarna.captureOrder(order.id);

// Transform a Crystallize basket model (from @crystallize/react-basket) to a Klarna model
const klarnaCart = Klarna.crystallizeBasketToKlarnaCart(crystallizeBasket.state);

```
