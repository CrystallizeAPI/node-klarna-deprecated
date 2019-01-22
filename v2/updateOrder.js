async function updateOrder ({ client, orderId, state }) {
  try {
    const response = await client.fetch(`/orders/${orderId}`, {
      body: state
    })

    if (response.ok) {
      return {
        success: true
      }
    }

    const error = await response.json()
    return {
      success: false,
      error
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

module.exports = updateOrder
