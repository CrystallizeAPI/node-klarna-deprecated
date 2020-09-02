async function cancelOrder ({ client, orderId }) {
  try {
    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/cancel`,
      {
        method: 'POST'
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

module.exports = cancelOrder
