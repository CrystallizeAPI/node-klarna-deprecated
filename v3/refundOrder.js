const getOrder = require('./getOrder')

async function refundOrder ({
  client,
  orderId,
  amount,
  description,
  reference,
  order_lines
}) {
  try {
    let refunded_amount = amount

    // No amount specified. Assuming the total order amount
    // should be captured
    if (!refunded_amount) {
      const { order } = await getOrder({ client, orderId })

      refunded_amount = order.order_amount
    }

    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/refunds`,
      {
        method: 'POST',
        body: {
          refunded_amount,
          description,
          reference,
          order_lines
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

module.exports = refundOrder
