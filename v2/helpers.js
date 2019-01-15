const fetch = require('cross-fetch')
const crypto = require('crypto')
const deepAssign = require('deep-assign')

const {
  KLARNA_MODE,
  KLARNA_MERCHANT_ID,
  KLARNA_SHARED_SECRET,
  KLARNA_RECURRING_TOKEN,
  KLARNA_TERMS_URI,
  KLARNA_STORE_NAME
} = process.env

const KLARNA_CONTENT_TYPE =
  'application/vnd.klarna.checkout.aggregated-order-v2+json'

const TEST_DRIVE = !['production', 'prod'].includes(KLARNA_MODE)

const CHECKOUT_URL_LIVE = 'https://checkout.klarna.com/checkout'
const CHECKOUT_URL_TEST = 'https://checkout.testdrive.klarna.com/checkout'
const PAYMENT_URL_LIVE = 'https://payment.klarna.com'
const PAYMENT_URL_TEST = 'https://payment.testdrive.klarna.com'

const CHECKOUT_URL = TEST_DRIVE ? CHECKOUT_URL_TEST : CHECKOUT_URL_LIVE
const PAYMENT_URL = TEST_DRIVE ? PAYMENT_URL_TEST : PAYMENT_URL_LIVE

const config = {}

function loadconfig () {
  if (
    !KLARNA_MERCHANT_ID ||
    !KLARNA_SHARED_SECRET ||
    !KLARNA_TERMS_URI ||
    !KLARNA_STORE_NAME
  ) {
    throw new Error(
      `Missing klarna env values (
        KLARNA_MERCHANT_ID = "${KLARNA_MERCHANT_ID}"
        KLARNA_STORE_NAME = "${KLARNA_STORE_NAME}"
        KLARNA_SHARED_SECRET = "${KLARNA_SHARED_SECRET}"
        KLARNA_TERMS_URI = "${KLARNA_TERMS_URI}"
        KLARNA_RECURRING_TOKEN = "${KLARNA_RECURRING_TOKEN}"
      )`
    )
  }

  Object.assign(config, {
    testDrive: TEST_DRIVE,
    id: TEST_DRIVE ? 200 : KLARNA_MERCHANT_ID,
    sharedSecret: TEST_DRIVE ? 'test' : KLARNA_SHARED_SECRET,
    recurringToken: KLARNA_RECURRING_TOKEN,
    termsUri: KLARNA_TERMS_URI,
    storeName: KLARNA_STORE_NAME,
    checkoutUrl: CHECKOUT_URL,
    paymentUrl: PAYMENT_URL
  })

  Object.freeze(config)
}

function getConfig () {
  return config
}

async function doFetch (path, optionsOverride) {
  const url = CHECKOUT_URL + path

  const options = deepAssign(
    {
      method: 'POST',
      headers: {
        Accept: KLARNA_CONTENT_TYPE
      }
    },
    optionsOverride
  )

  if (
    !Object.hasOwnProperty.call(options.headers, 'Content-Type') &&
    options.method.toLowerCase() === 'post'
  ) {
    options.headers['Content-Type'] = KLARNA_CONTENT_TYPE
  }

  const useTestCredentials =
    (path === '' || path === '/') && KLARNA_MODE === 'test'

  if (options.body) {
    if (typeof options.body !== 'string') {
      let { body } = options

      if (body && useTestCredentials) {
        if (body.merchant) {
          body.merchant.id = 200
        }
      }

      options.body = JSON.stringify(body)
    }
  }

  if (!options.headers.Authorization) {
    let hashBase = useTestCredentials ? 'test' : config.sharedSecret
    if (options.body) {
      hashBase = options.body + hashBase
    }

    const hash = crypto
      .createHash('sha256')
      .update(hashBase, 'utf-8')
      .digest('base64')

    options.headers.Authorization = `Klarna ${hash}`
  }

  return fetch(url, options)
}

loadconfig()

module.exports = {
  doFetch,
  getConfig
}
