require('dotenv').config()

const express = require('express')

const V2 = require('../../v2')
const { cart, merchant } = require('../../tests/v2/mockData')

const server = express()
const router = express.Router()

const client = new V2({
  testDrive: !['prod', 'production'].includes(process.env.KLARNA_MODE),
  merchantId: process.env.KLARNA_MERCHANT_ID,
  sharedSecret: process.env.KLARNA_SHARED_SECRET,
  termsUri: process.env.KLARNA_TERMS_URI,
  storeName: process.env.KLARNA_STORE_NAME
})

router.get('/', async (req, res) => {
  const { success, order } = await client.createOrder({
    cart,
    merchant: {
      ...merchant,
      confirmation_uri:
        'http://localhost:1234/confirmation?id={checkout.order.id}'
    }
  })

  res.send(
    `
    <html>
      <body>
        ${!success ? 'NOT CREATED' : order.gui.snippet}
      </body>
    </html>
  `
  )
})

router.get('/confirmation', async (req, res) => {
  const { id } = req.query
  const { success, error } = await client.confirmOrder(id)
  const { order } = await client.getOrder(id)

  res.send(
    `
    <html>
      <body>
        <h1>Confirm status: ${error ? JSON.stringify(error) : success}</h1>
        <div><a href="/capture?id=${id}">Click to capture</a></div>
        ${!order ? 'NOT SUCCESS' : order.gui.snippet}
      </body>
    </html>
  `
  )
})

router.get('/confirm', async (req, res) => {
  const { id } = req.query
  const { success, error } = await client.confirmOrder(id)
  res.send(
    `
    <html>
      <body>
      <h1>Confirm status: ${
  error ? JSON.stringify(error) : success.toString()
}</h1>
      </body>
    </html>
  `
  )
})

router.get('/capture', async (req, res) => {
  const { id } = req.query
  const { success, error, OCRCode } = await client.captureOrder(id)
  res.send(
    `
    <html>
      <body>
      <h1>Capture status: ${
  error
    ? JSON.stringify(error)
    : `${success.toString()}. OCR code: ${OCRCode}`
}</h1>
      </body>
    </html>
  `
  )
})

server.use(router)

server.listen(1234, () => console.log('Ready on 1234'))
