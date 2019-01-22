async function getRecurringOrderStatus ({ client, id }) {
  const klarnaOrderResponse = await client.fetch(`/recurring/${id}`, {
    method: 'get',
    headers: {
      Accept: null,
      'Content-Type':
        'application/vnd.klarna.checkout.recurring-status-v1+json'
    }
  })

  if (klarnaOrderResponse.status === 200) {
    return {
      success: true,
      data: await klarnaOrderResponse.json()
    }
  }

  const responseText = await klarnaOrderResponse.text()
  return {
    success: false,
    data: responseText
  }
}

module.exports = getRecurringOrderStatus
