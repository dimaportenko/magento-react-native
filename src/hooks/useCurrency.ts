/**
 * Created by Dima Portenko on 14.05.2020
 */
import React from 'react';
import { useSelector } from 'react-redux';

export const useCurrency = props => {
  const { currencyRate, currencySymbol } = useSelector(state => {
    const {
      currency: {
        displayCurrencySymbol: currencySymbol,
        displayCurrencyExchangeRate: currencyRate,
      },
    } = state.magento;

    return {
      currencyRate,
      currencySymbol,
    };
  });

  return { currencyRate, currencySymbol };
};
