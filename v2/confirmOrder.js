const { doFetch } = require('./helpers')

async function confirmOrder (orderId) {
  try {
    const response = await doFetch(`/${orderId}`, {
      body: { status: 'created' }
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

module.exports = confirmOrder
