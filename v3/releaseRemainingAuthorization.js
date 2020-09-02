async function releaseAuthorization ({ client, orderId }) {
  try {
    const response = await client.fetch(
      `/ordermanagement/v1/orders/${orderId}/release-remaining-authorization`,
      {
        method: 'POST'
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
