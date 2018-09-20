const cart = {
  items: [
    {
      reference: '123456789',
      name: 'Klarna t-shirt',
      quantity: 2,
      ean: '1234567890123',
      uri: 'http://example.com/product.php?123456789',
      image_uri: 'http://example.com/product_image.php?123456789',
      unit_price: 12300,
      discount_rate: 1000,
      tax_rate: 2500
    }
  ]
}

const merchant = {
  back_to_store_uri: 'http://example.com',
  terms_uri: 'http://example.com/terms.php',
  checkout_uri: 'https://example.com/checkout.php',
  confirmation_uri: 'https://example.com/thankyou.php?sid=123&klarna_order={checkout.order.id}',
  push_uri: 'https://example.com/push.php?sid=123&klarna_order={checkout.order.id}'
}

module.exports = {
  cart,
  merchant
}
