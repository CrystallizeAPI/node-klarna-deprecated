function confirmOrder ({ client, orderId }) {
  return client.updateOrder(orderId, { status: 'created' })
}

module.exports = confirmOrder
