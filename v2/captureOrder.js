const crypto = require('crypto')
const crossFetch = require('cross-fetch')
const { parseString } = require('xml2js')

function captureOrder ({ client, mixed }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    let reservation

    // Looks like we got an order id. Lets get the order
    if (typeof mixed === 'string') {
      const { success, order } = await client.getOrder(mixed)

      if (!success) {
        return resolve({
          success: false,
          error: 'Could not get Klarna order'
        })
      }

      ;({ reservation } = order)
    } else {
      ;({ reservation } = mixed)
    }

    if (!reservation) {
      return resolve({
        success: false,
        error: 'Could not retrieve reservation number'
      })
    }

    const digest = crypto
      .createHash('sha512')
      .update(
        `4:1:xmlrpc:${client.config.storeName}:2:${client.config.merchantId}:${reservation}:${client.config.sharedSecret}`,
        'utf-8'
      )
      .digest('base64')

    const response = await crossFetch(client.config.paymentUrl, {
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
              <string>xmlrpc:${client.config.storeName}:2</string>
            </value>
          </param>
          <param>
            <value>
              <!-- merchant id (eid) -->
              <int>${client.config.merchantId}</int>
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
              <string>${reservation}</string>
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

    if (response.status === 406) {
      return resolve({
        success: false,
        error: 'Not acceptable'
      })
    }

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
