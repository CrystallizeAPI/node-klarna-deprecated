const getOrder = require('./getOrder')

async function captureOrder ({ client, orderId, amount }) {
  try {
    let captured_amount = amount

    // No amount specified. Assuming the total order amount
    // should be captured
    if (!captured_amount) {
      const { order } = await getOrder({ client, orderId })

      captured_amount = order.order_amount
    }

    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/captures`,
      {
        method: 'POST',
        body: {
          captured_amount
        }
      }
    )

    if (response.ok) {
      return { success: true }
    }

    return { success: false, error: await response.json() }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = captureOrder
