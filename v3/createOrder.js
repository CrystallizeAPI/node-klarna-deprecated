async function createOrder ({ client, order }) {
  try {
    const response = await client.fetch('/checkout/v3/orders', {
      method: 'POST',
      body: order
    })

    const json = await response.json()

    if (response.ok) {
      return { success: true, order: json }
    }

    return { success: false, error: json }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = createOrder
