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

const CHECKOUT_URL_LIVE = 'https://checkout.klarna.com/checkout/orders'
const CHECKOUT_URL_TEST =
  'https://checkout.testdrive.klarna.com/checkout/orders'
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

  if (options.body) {
    if (typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
  }

  if (!options.headers.Authorization) {
    let hashBase = config.sharedSecret
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

function modeSubscriptionDates (item) {
  const curDate = new Date()
  const initDate = new Date()
  const renewDate = new Date()

  const initial_period_unit = item.initial_period_unit
    .toLowerCase()
    .replace(/s$/, '')

  if (initial_period_unit === 'day') {
    initDate.setDate(curDate.getDate() + item.initial_period)
  } else if (initial_period_unit === 'week') {
    initDate.setDate(curDate.getDate() + item.initial_period * 7)
  } else if (initial_period_unit === 'month') {
    initDate.setMonth(curDate.getMonth() + item.initial_period)
  } else if (initial_period_unit === 'year') {
    initDate.setMonth(curDate.getMonth() + item.initial_period * 12)
  }

  // if we get initial period with values
  // create subscr. oly for initial values  and set klarna renew

  // then for real duration
  let curmonth
  const duration_unit = item.duration_unit.toLowerCase().replace(/s$/, '')

  if (duration_unit === 'day') {
    renewDate.setDate(curDate.getDate() + item.duration)
  } else if (duration_unit === 'week') {
    renewDate.setDate(curDate.getDate() + item.duration * 7)
  } else if (duration_unit === 'month') {
    if (curDate.getDate() === 31) {
      curmonth = curDate.getMonth()
      if (
        curmonth === 3 ||
        curmonth === 5 ||
        curmonth === 8 ||
        curmonth === 10
      ) {
        renewDate.setDate(30)
      } else if (curmonth === 1 && curDate.getYear % 4 === 0) {
        renewDate.setDate(29)
      } else if (curmonth === 1 && curDate.getYear % 4 !== 0) {
        renewDate.setDate(28)
      }
    } else if (curDate.getDate() === 30) {
      curmonth = curDate.getMonth()
      if (
        curmonth !== 3 &&
        curmonth !== 5 &&
        curmonth !== 8 &&
        curmonth !== 10
      ) {
        renewDate.setDate(31)
      } else if (curmonth === 1 && curDate.getYear % 4 === 0) {
        renewDate.setDate(29)
      } else if (curmonth === 1 && curDate.getYear % 4 !== 0) {
        renewDate.setDate(28)
      }
    } else if (curDate.getDate() === 28 && curDate.getMonth() === 1) {
      renewDate.setDate(31)
    }
    renewDate.setMonth(curDate.getMonth() + item.duration)
  } else if (duration_unit === 'year') {
    if (
      curmonth === 1 &&
      curDate.getYear % 4 === 0 &&
      curDate.getDate() === 29
    ) {
      renewDate.setDate(28)
    }
    renewDate.setMonth(curDate.getMonth() + item.duration * 12)
  }
  return {
    initDate,
    renewDate
  }
}

loadconfig()

module.exports = {
  doFetch,
  getConfig,
  modeSubscriptionDates
}
