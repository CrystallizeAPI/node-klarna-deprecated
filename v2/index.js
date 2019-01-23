const ow = require('ow')
const crossFetch = require('cross-fetch')
const crypto = require('crypto')
const deepAssign = require('deep-assign')

const getOrder = require('./getOrder')
const createOrder = require('./createOrder')
const confirmOrder = require('./confirmOrder')
const updateOrder = require('./updateOrder')
const captureOrder = require('./captureOrder')
const createRecurringOrder = require('./createRecurringOrder')
const getRecurringOrderStatus = require('./getRecurringOrderStatus')
const crystallizeBasketToKlarnaCart = require('./crystallizeBasketToKlarnaCart')

module.exports = class KlarnaV2Client {
  constructor (config) {
    this.CHECKOUT_URL_LIVE = 'https://checkout.klarna.com/checkout'
    this.CHECKOUT_URL_TEST = 'https://checkout.testdrive.klarna.com/checkout'
    this.PAYMENT_URL_LIVE = 'https://payment.klarna.com'
    this.PAYMENT_URL_TEST = 'https://payment.testdrive.klarna.com'

    this.setConfig(config)

    this.contentTypeCheckout =
      'application/vnd.klarna.checkout.aggregated-order-v2+json'

    this.crystallizeBasketToKlarnaCart = crystallizeBasketToKlarnaCart
  }

  setConfig (config) {
    this.config = {}

    ow(config.testDrive, ow.boolean)

    if (config.useTestMerchant) {
      Object.assign(this.config, {
        merchantId: 200,
        sharedSecret: 'test',
        storeName: 'demo'
      })
    } else {
      ow(config.merchantId, ow.string)
      ow(config.sharedSecret, ow.string)
      ow(config.storeName, ow.string)
    }

    Object.assign(this.config, config)

    this.config.checkoutUrl = config.testDrive
      ? this.CHECKOUT_URL_TEST
      : this.CHECKOUT_URL_LIVE
    this.config.paymentUrl = config.testDrive
      ? this.PAYMENT_URL_TEST
      : this.PAYMENT_URL_LIVE
  }

  async fetch (path, optionsOverride) {
    const url = this.config.checkoutUrl + path

    const options = deepAssign(
      {
        method: 'POST',
        headers: {
          Accept: this.contentTypeCheckout
        }
      },
      optionsOverride
    )

    if (
      !Object.hasOwnProperty.call(options.headers, 'Content-Type') &&
      options.method.toLowerCase() === 'post'
    ) {
      options.headers['Content-Type'] = this.contentTypeCheckout
    }

    if (options.body) {
      if (typeof options.body !== 'string') {
        let { body } = options

        options.body = JSON.stringify(body)
      }
    }

    if (!options.headers.Authorization) {
      let hashBase = this.config.sharedSecret
      if (options.body) {
        hashBase = options.body + this.config.sharedSecret
      }

      const hash = crypto
        .createHash('sha256')
        .update(hashBase, 'utf-8')
        .digest('base64')

      options.headers.Authorization = `Klarna ${hash}`
    }

    return crossFetch(url, options)
  }

  createOrder (options) {
    return createOrder({ client: this, options })
  }

  getOrder (orderId) {
    return getOrder({ client: this, orderId })
  }

  updateOrder (orderId, state) {
    return updateOrder({ client: this, orderId, state })
  }

  confirmOrder (orderId) {
    return confirmOrder({ client: this, orderId })
  }

  captureOrder (mixed) {
    return captureOrder({ client: this, mixed })
  }

  createRecurringOrder (options, { recurring_token }) {
    return createRecurringOrder({ client: this, options, recurring_token })
  }

  getRecurringOrderStatus (id) {
    return getRecurringOrderStatus({ client: this, id })
  }
}
