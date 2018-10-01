const deepAssign = require('deep-assign')

function crystallizeBasketToKlarnaCart (crystallizeBasket) {
  return {
    ...crystallizeBasket,
    items: crystallizeBasket.items
      .filter(item => item.type !== 'discount')
      .map(i => {
        const item = deepAssign({}, i)

        item.tax_rate = item.tax_rate || item.vat || 0
        item.discount_rate = item.discount_rate || 0
        delete item.vat

        // Klarna deals with units without comma separator
        item.unit_price *= 100
        item.tax_rate *= 100
        item.discount_rate *= 100

        return item
      })
  }
}

module.exports = crystallizeBasketToKlarnaCart
