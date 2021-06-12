import { currencySymbols } from '../config/magento';

export function finalPrice(data, price) {
  let specialPrice = price;
  const result = data.filter(item => item.attribute_code === 'special_price');
  if (result.length) {
    const splittedValue = result[0].value.split('.');
    specialPrice = splittedValue[0];
  }
  return specialPrice;
}

export const priceSignByCode = code => {
  const sign = currencySymbols[code];
  if (sign) {
    return sign;
  }
  // If no currency symbol specified for currency code, return currency code
  return code;
};

export const currencyExchangeRateByCode = (code, exchangeRates) => {
  const result = exchangeRates.find(
    exchangeRate => exchangeRate.currency_to === code,
  );
  if (result) {
    return result.rate;
  }
  return 1;
};
