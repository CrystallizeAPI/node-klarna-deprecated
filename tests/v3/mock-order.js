module.exports = {
  purchase_country: 'NO',
  purchase_currency: 'NOK',
  locale: 'no-nb',
  order_lines: [
    {
      type: 'physical',
      name: 'Awesome t-shirt',
      quantity: 2,
      unit_price: 12300,
      tax_rate: 2500,
      total_amount: 24600,
      total_tax_amount: 4920
    },
    {
      type: 'shipping_fee',
      name: 'Regular shipping',
      quantity: 1,
      unit_price: 9900,
      tax_rate: 2500,
      total_amount: 9900,
      total_tax_amount: 1980
    }
  ],
  order_amount: 34500,
  order_tax_amount: 6900,
  merchant_urls: {
    terms: 'http://example.com',
    checkout: 'http://example.com',
    confirmation: 'https://example.com/thankyou.php',
    push: 'https://example.com/push.php'
  }
}
