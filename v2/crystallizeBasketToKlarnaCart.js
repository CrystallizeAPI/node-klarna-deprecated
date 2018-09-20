function crystallizeBasketToKlarnaCart (crystallizeBasket) {
  return {
    ...crystallizeBasket,
    items: crystallizeBasket.items
      .filter(item => item.type !== 'discount')
      .map(i => {
        const item = { ...i }

        item.tax_rate = item.tax_rate || item.vat || 0
        item.discount_rate = item.discount_rate || 0
        delete item.vat

        // Klarna deals with prices without comma separator
        item.unit_price *= 100

        // Add the attributes to the name
        if (item.attributes && item.attributes.length > 0) {
          const [first] = item.attributes
          if (
            first.attribute_key.match(/novariation/i) &&
            first.attribute_value.match(/standard/i)
          ) {
            return item
          }

          return {
            ...item,
            name: `${item.name} ${item.attributes
              .map(a => a.attribute_value)
              .join(' ')
              .toLowerCase()}`
          }
        }
        return item
      })
  }
}

module.exports = crystallizeBasketToKlarnaCart
