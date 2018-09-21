const crypto = require('crypto')
const { parseString } = require('xml2js')
const fetch = require('cross-fetch')

const { getConfig } = require('./helpers')
const getOrder = require('./getOrder')

const config = getConfig()

function captureOrder (orderId) {
  return new Promise(async resolve => {
    const { order } = await getOrder(orderId)

    const digest = crypto
      .createHash('sha512')
      .update(
        `4:1:xmlrpc:${config.storeName}:2:${config.id}:${order.reservation}:${config.sharedSecret}`,
        'utf-8'
      )
      .digest('base64')

    const response = await fetch(config.paymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'request'
      },
      body: `<?xml version="1.0" encoding="ISO-8859-1"?>
      <methodCall>
        <methodName>activate</methodName>
        <params>
          <param>
            <value>
               <!-- proto_vsn -->
              <string>4.1</string>
            </value>
          </param>
          <param>
            <value>
              <!-- client_vsn -->
              <string>xmlrpc:${config.storeName}:2</string>
            </value>
          </param>
          <param>
            <value>
              <!-- merchant id (eid) -->
              <int>${config.id}</int>
            </value>
          </param>
          <param>
            <value>
              <!-- shared_secret -->
              <string>${digest}</string>
            </value>
          </param>
          <param>
            <value>
              <!-- rno -->
              <string>${order.reservation}</string>
            </value>
          </param>
          <param>
          <value>
            <!-- optional_info struct -->
          </value>
        </param>
        </params>
      </methodCall>`
    })

    const body = await response.text()

    parseString(body, (error, result) => {
      if (error) {
        return resolve({
          success: false,
          error
        })
      }

      const { fault } = result.methodResponse

      if (fault) {
        return resolve({
          success: false,
          error: JSON.stringify(fault)
        })
      }

      try {
        const OCRCode =
          result.methodResponse.params[0].param[0].value[0].array[0].data[0]
            .value[1].string[0]
        if (OCRCode) {
          resolve({ success: true, OCRCode })
        } else {
          resolve({
            success: false,
            error: 'Request succeeded, but could not extract value from result',
            result
          })
        }
      } catch (error) {
        resolve({ success: false, error })
      }
    })
  })
}

module.exports = captureOrder
