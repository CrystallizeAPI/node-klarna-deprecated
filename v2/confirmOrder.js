const updateOrder = require('./updateOrder')

async function confirmOrder (orderId) {
  return updateOrder(orderId, { status: 'created' })
}

module.exports = confirmOrder
