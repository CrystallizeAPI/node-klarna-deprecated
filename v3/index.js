const ow = require('ow')
const fetch = require('cross-fetch')
const deepAssign = require('deep-assign')

const getOrder = require('./getOrder')
const createOrder = require('./createOrder')
const acknowledgeOrder = require('./acknowledgeOrder')
const captureOrder = require('./captureOrder')

const URL_LIVE = 'https://api.klarna.com'
const URL_TEST = 'https://api.playground.klarna.com'

module.exports = class KlarnaV3Client {
  constructor (config) {
    ow(config.testDrive, ow.boolean)
    ow(config.username, ow.string)
    ow(config.password, ow.string)

    this.config = {
      ...config,
      baseUrl: config.testDrive ? URL_TEST : URL_LIVE
    }
  }

  async fetch (path, optionsOverride) {
    const url = this.config.baseUrl + path

    const options = deepAssign(
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              this.config.username + ':' + this.config.password
            ).toString('base64')
        }
      },
      optionsOverride
    )

    if (options.body) {
      options.headers['Content-Type'] = ' application/json'

      // Ensure body is stringified
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body)
      }
    }

    return fetch(url, options)
  }

  createOrder (order) {
    return createOrder({ client: this, order })
  }

  getOrder (orderId) {
    return getOrder({ client: this, orderId })
  }

  acknowledgeOrder (orderId) {
    return acknowledgeOrder({ client: this, orderId })
  }

  captureOrder ({ ...args }) {
    return captureOrder({ client: this, ...args })
  }
}
