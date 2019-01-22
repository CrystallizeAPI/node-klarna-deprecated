const deepAssign = require('deep-assign')

async function createRecurringOrder ({ client, options, recurring_token }) {
  // Construct a valid Klarna order model
  const order = deepAssign(
    {
      purchase_country: 'NO',
      purchase_currency: 'NOK',
      locale: 'nb-no',
      merchant: {
        id: (client.config.merchantId || '').toString()
      },
      cart: {}
    },
    options
  )

  const klarnaOrderResponse = await client.fetch(
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
