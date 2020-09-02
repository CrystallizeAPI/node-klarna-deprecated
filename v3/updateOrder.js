async function updateOrder({ client, orderId, body }) {
  try {
    const response = await client.fetch(`/checkout/v3/orders/${orderId}`, {
      method: "POST",
      body,
    });

    if (response.ok) {
      return { success: true, order: await response.json() };
    }

    return { success: false, error: await response.json() };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = updateOrder;
