import React from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { ModalSelect } from '../common';
import {
  priceSignByCode,
  currencyExchangeRateByCode,
} from '../../helper/price';
import { changeCurrency } from '../../actions';

const CurrencyPicker = ({
  currencies,
  exchangeRates,
  selectedCurrencyCode,
  changeCurrency: _changeCurrency,
}) => {
  const data = currencies.map(value => ({
    label: value,
    key: value,
  }));

  const onChange = (atrribute, itemValue) => {
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

CurrencyPicker.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string),
  exchangeRates: PropTypes.arrayOf(
    PropTypes.shape({
      currency_to: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
    }),
  ),
  selectedCurrencyCode: PropTypes.string,
  changeCurrency: PropTypes.func.isRequired,
};

CurrencyPicker.defaultProps = {
  currencies: [],
  exchangeRates: [],
  selectedCurrencyCode: '',
};

const mapStatetoProps = ({ magento }) => {
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
