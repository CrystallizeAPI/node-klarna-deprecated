const deepAssign = require('deep-assign')

function crystallizeBasketToKlarnaCart (crystallizeBasket) {
  const items = crystallizeBasket.items.map(i => deepAssign({}, i))

  if ('shipping' in crystallizeBasket) {
    const shippingItem = {
      type: 'shipping_fee',
      reference: 'SHIPPING',
      name: 'Shipping fee',
      quantity: 1,
      ...crystallizeBasket.shipping
    }

    delete shippingItem.total_price_excluding_tax
    delete shippingItem.total_price_including_tax
    delete shippingItem.total_tax_amount

    items.push(shippingItem)
  }

  return {
    ...crystallizeBasket,
    items: items.map(item => {
      item.tax_rate = item.tax_rate || item.vat || 0
      item.discount_rate = item.discount_rate || 0
      delete item.vat

      item.unit_price = item.unit_price || item.price

      // Klarna deals with units without comma separator
      item.unit_price *= 100
      item.tax_rate *= 100
      item.discount_rate *= 100

      return item
    })
  }
}

module.exports = crystallizeBasketToKlarnaCart
