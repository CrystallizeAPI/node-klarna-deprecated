async function acknowledgeOrder ({ client, orderId }) {
  try {
    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/acknowledge`,
      {
        method: 'POST'
      }
    )

    if (response.ok) {
      return { success: true }
    }

    console.log(response.status)

    if (response.status === '404') {
      return { success: false, error: 'Order not found.' }
    }

    if (response.status === '403') {
      return { success: false, error: 'Update not allowed.' }
    }

    return { success: false }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = acknowledgeOrder
