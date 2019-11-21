import { REHYDRATE } from 'redux-persist/es/constants';
import {
  MAGENTO_GET_COUNTRIES, MAGENTO_INIT, MAGENTO_INIT_ERROR, MAGENTO_STORE_CONFIG, MAGENTO_GET_CURRENCY,
} from '../actions/types';
import { magento } from '../magento';

const INITIAL_STATE = {
  magento: null,
  storeConfig: null,
  countries: null,
  currency: {
    default_display_currency_code: '',
    default_display_currency_symbol: '',
    /**
     * Below three keys will be used in the APP
     */
    displayCurrencyCode: '',
    displayCurrencySymbol: '',
    displayCurrencyExchangeRate: 1,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload
        && action.payload.magento
        && action.payload.magento.storeConfig
      ) {
        magento.setStoreConfig(action.payload.magento.storeConfig);
      }
      return state;
    }
    case MAGENTO_STORE_CONFIG: {
      if (Array.isArray(action.payload) && action.payload.length) {
        return { ...state, errorMessage: null, storeConfig: action.payload[0] };
      }
      return state;
    }
    case MAGENTO_GET_CURRENCY: {
      const {
        currencyData,
        displayCurrency: {
          code,
          symbol,
          rate
        }
      } = action.payload;
      return {
        ...state,
        errorMessage: null,
        currency: {
          ...state.currency,
          ...currencyData,
          displayCurrencyCode: code,
          displayCurrencySymbol: symbol,
          displayCurrencyExchangeRate: rate,
        }
      };
    }
    case MAGENTO_GET_COUNTRIES: {
      return { ...state, countries: action.payload };
    }
    case MAGENTO_INIT:
      return { ...state, magento: action.payload };
    case MAGENTO_INIT_ERROR:
      return { ...state, errorMessage: action.payload.errorMessage };
    default:
      return state;
  }
};
