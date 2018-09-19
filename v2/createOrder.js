const deepAssign = require('deep-assign')

const { getConfig, doFetch } = require('./helpers')
const getOrder = require('./getOrder')

async function createOrder (options) {
  const config = getConfig()

  // Construct a valid Klarna order model
  const order = deepAssign(
    {
      purchase_country: 'NO',
      purchase_currency: 'NOK',
      locale: 'nb-no',
      merchant: {
        id: config.id
      },
      cart: {}
    },
    options
  )

  const klarnaOrderResponse = await doFetch('', {
    method: 'POST',
    body: order
  })

  if (klarnaOrderResponse.status === 201) {
    const location = klarnaOrderResponse.headers.get('location')
    const orderIdMatch = location.match(/\/([a-z0-9]+)$/i)

    if (orderIdMatch) {
      return getOrder(orderIdMatch[1])
    }
  }

  const responseText = await klarnaOrderResponse.text()
  throw new Error(responseText)
}

module.exports = createOrder
