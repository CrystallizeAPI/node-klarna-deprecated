require('dotenv').config()

const express = require('express')

const V3 = require('../../v3')
const { merchant_urls, ...mockOrder } = require('../../tests/v3/mock-order')

const server = express()
const router = express.Router()

const client = new V3({
  testDrive: true,
  username: 'PK09050_9d24214fd5f2',
  password: 'WJhGB7dkghVaQExH'
})

router.get('/', async (req, res) => {
  const { success, order, message } = await client.createOrder({
    ...mockOrder,
    merchant_urls: {
      ...merchant_urls,
      confirmation: 'http://localhost:1234/confirmation?id={checkout.order.id}'
    }
  })

  res.send(
    `
    <html>
      <body>
        ${!success ? JSON.stringify(message) : order.html_snippet}
      </body>
    </html>
  `
  )
})

router.get('/confirmation', async (req, res) => {
  const { id } = req.query
  const { success, error } = await client.acknowledgeOrder(id)

  res.send(
    `
    <html>
      <body>
        <h1>Acknowledge status: ${error ? JSON.stringify(error) : success}</h1>
        <div><a href="/capture?id=${id}">Click to capture</a></div>
      </body>
    </html>
  `
  )
})

router.get('/capture', async (req, res) => {
  const { id } = req.query
  const { success, error } = await client.captureOrder({ orderId: id })
  res.send(
    `
    <html>
      <body>
      <h1>Capture status: ${
        error ? JSON.stringify(error) : `${success.toString()}`
      }</h1>
      </body>
    </html>
  `
  )
})

server.use(router)

server.listen(1234, () => console.log('Ready on 1234'))
