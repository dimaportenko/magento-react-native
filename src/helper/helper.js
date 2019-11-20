export function finalPrice(data, price) {
  let specialPrice = price;
  const result = data.filter(item => item.attribute_code === 'special_price');
  if (result.length) {
    const splittedValue = result[0].value.split('.');
    specialPrice = splittedValue[0];
  }
  return specialPrice;
}
