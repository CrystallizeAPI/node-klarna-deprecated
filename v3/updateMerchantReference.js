async function releaseAuthorization ({
  client,
  orderId,
  merchant_reference1,
  merchant_reference2
}) {
  try {
    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/merchant-references`,
      {
        method: 'PATCH',
        body: {
          merchant_reference1,
          merchant_reference2
        }
      }
    )

    if (response.ok) {
      return { success: true }
    }

    return { success: false, error: await response.json() }
  } catch (error) {
    return { success: false, error }
  }
}

module.exports = releaseAuthorization
