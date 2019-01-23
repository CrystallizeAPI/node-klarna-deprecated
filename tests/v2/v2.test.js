require('dotenv').config()

const { cart, merchant } = require('./mockData')

const V2 = require('../../v2')

const client = new V2({
  testDrive: true,
  useTestMerchant: true
})

test('an order is created', async () => {
  const createOrderResult = await client.createOrder({ cart, merchant })
  expect(createOrderResult.success).toBe(true)
  expect(createOrderResult.order).toHaveProperty('id')
})

test('an order is created and confirmed', async () => {
  expect.assertions(3)

  const createOrderResult = await client.createOrder({ cart, merchant })
  expect(createOrderResult.success).toBe(true)
  expect(createOrderResult.order).toHaveProperty('id')

  const confirmResult = await client.confirmOrder(createOrderResult.order.id)
  expect(confirmResult.success).toBe(true)
})

test('crystallize basket is normalized correctly', () => {
  const normalized = client.crystallizeBasketToKlarnaCart({
    shipping: {
      name: 'Super fast shipping',
      price: 69,
      tax_rate: 25
    },
    items: [
      {
        unit_price: 99.99,
        tax_rate: 15,
        discount_rate: 20
      }
    ]
  })
  expect(normalized).toMatchObject({
    items: [
      {
        unit_price: 9999,
        tax_rate: 1500,
        discount_rate: 2000
      },
      {
        type: 'shipping_fee',
        reference: 'SHIPPING',
        name: 'Super fast shipping',
        quantity: 1,
        unit_price: 6900,
        tax_rate: 2500
      }
    ]
  })
})

test('crystallize basket with free shipping is normalized correctly', () => {
  const normalized = client.crystallizeBasketToKlarnaCart({
    freeShipping: true,
    shipping: {
      name: 'Super fast shipping',
      price: 69,
      tax_rate: 25
    },
    items: [
      {
        unit_price: 99.99,
        tax_rate: 15,
        discount_rate: 20
      }
    ]
  })
  expect(normalized).toMatchObject({
    items: [
      {
        unit_price: 9999,
        tax_rate: 1500,
        discount_rate: 2000
      }
    ]
  })
})
