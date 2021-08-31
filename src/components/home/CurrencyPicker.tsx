import React, { FC } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { ModalSelect } from '../common';
import {
  priceSignByCode,
  currencyExchangeRateByCode,
} from '../../helper/price';
import { changeCurrency } from '../../actions';
import { StoreStateType } from '../../reducers';
import { MagentoReducerType } from '../../reducers/MagentoReducer';

const CurrencyPicker: FC<{
  currencies: MagentoReducerType['currency']['available_currency_codes'];
  exchangeRates: MagentoReducerType['currency']['exchange_rates'];
  selectedCurrencyCode: MagentoReducerType['currency']['displayCurrencyCode'];
  changeCurrency: typeof changeCurrency;
}> = ({
  currencies,
  exchangeRates,
  selectedCurrencyCode,
  changeCurrency: _changeCurrency,
}) => {
  const data = currencies.map(value => ({
    label: value,
    key: value,
  }));

  const onChange = (atrribute: string, itemValue: string) => {
    _changeCurrency(
      itemValue,
      priceSignByCode(itemValue),
      currencyExchangeRateByCode(itemValue, exchangeRates),
    );
    AsyncStorage.setItem('currency_code', itemValue);
  };

  return (
    <ModalSelect
      disabled={data.length === 0}
      label={selectedCurrencyCode}
      attribute="CurrencyCode"
      withLabel={false}
      data={data}
      onChange={onChange}
      style={styles.currencyContainer}
    />
  );
};

const styles = {
  currencyContainer: {
    width: 50,
    marginEnd: 10,
  },
};

const mapStatetoProps = ({ magento }: StoreStateType) => {
  const {
    currency: {
      available_currency_codes: currencies,
      exchange_rates: exchangeRates,
      displayCurrencyCode: selectedCurrencyCode,
    },
  } = magento;
  return {
    currencies,
    exchangeRates,
    selectedCurrencyCode,
  };
};

export default connect(mapStatetoProps, { changeCurrency })(CurrencyPicker);
