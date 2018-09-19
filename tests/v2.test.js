const { cart, merchant } = require('./mockData')

const v2 = require('../v2')

test('an order is created', async () => {
  const createOrderResult = await v2.createOrder({ cart, merchant })
  expect(createOrderResult.success).toBe(true)
  expect(createOrderResult.order).toHaveProperty('id')
})

test('an order is created and confirmed', async () => {
  expect.assertions(3)

  const createOrderResult = await v2.createOrder({ cart, merchant })
  expect(createOrderResult.success).toBe(true)
  expect(createOrderResult.order).toHaveProperty('id')

  const confirmResult = await v2.confirmOrder(createOrderResult.order.id)
  expect(confirmResult.success).toBe(true)
})
