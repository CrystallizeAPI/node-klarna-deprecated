async function getOrder ({ client, orderId }) {
  try {
    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      return { success: false }
    }

    const order = await response.json()

    return { success: true, order }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = getOrder
