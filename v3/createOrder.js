async function createOrder ({ client, order }) {
  try {
    const response = await client.fetch('/checkout/v3/orders', {
      method: 'POST',
      body: order
    })

    if (response.headers.get('content-type') === 'text/html') {
      return {
        success: false,
        error: await response.text()
      }
    }

    if (response.ok) {
      return { success: true, order: await response.json() }
    }

    return { success: false, error: response.status }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = createOrder
