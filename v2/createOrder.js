const deepAssign = require('deep-assign')

async function createOrder ({ client, options }) {
  // Construct a valid Klarna order model
  const order = deepAssign(
    {
      purchase_country: 'NO',
      purchase_currency: 'NOK',
      locale: 'nb-no',
      merchant: {
        id: client.config.merchantId
      },
      cart: {}
    },
    options
  )

  const klarnaOrderResponse = await client.fetch('/orders', {
    method: 'POST',
    body: order
  })

  if (klarnaOrderResponse.status === 201) {
    const location = klarnaOrderResponse.headers.get('location')
    const orderIdMatch = location.match(/\/([a-z0-9]+)$/i)

    if (orderIdMatch) {
      return client.getOrder(orderIdMatch[1])
    }
  }

  const responseText = await klarnaOrderResponse.text()
  throw new Error(responseText)
}

module.exports = createOrder
