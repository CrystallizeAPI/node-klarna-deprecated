const deepAssign = require('deep-assign')

const { getConfig, doFetch } = require('./helpers')

async function createRecurringOrder (options, { recurring_token }) {
  const config = getConfig()

  // Construct a valid Klarna order model
  const order = deepAssign(
    {
      purchase_country: 'NO',
      purchase_currency: 'NOK',
      locale: 'nb-no',
      merchant: {
        id: (config.id || '').toString()
      },
      cart: {}
    },
    options
  )

  const klarnaOrderResponse = await doFetch(
    `/recurring/${recurring_token}/orders`,
    {
      method: 'POST',
      body: order,
      headers: {
        Accept:
          'application/vnd.klarna.checkout.recurring-order-accepted-v1+json',
        'Content-Type':
          'application/vnd.klarna.checkout.recurring-order-v1+json'
      }
    }
  )

  if (klarnaOrderResponse.status === 200) {
    return {
      success: true,
      order: await klarnaOrderResponse.json()
    }
  }

  return {
    success: false,
    error: await klarnaOrderResponse.text()
  }
}

module.exports = createRecurringOrder
