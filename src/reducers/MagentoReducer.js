import { REHYDRATE } from 'redux-persist/es/constants';
import {
  MAGENTO_GET_COUNTRIES, MAGENTO_INIT, MAGENTO_STORE_CONFIG,
} from '../actions/types';
import { magento } from '../magento';

const INITIAL_STATE = {
  magento: null,
  storeConfig: null,
  countries: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload &&
        action.payload.magento &&
        action.payload.magento.storeConfig
      ) {
        magento.setStoreConfig(action.payload.magento.storeConfig);
      }
      return state;
    }
    case MAGENTO_STORE_CONFIG: {
      if (Array.isArray(action.payload) && action.payload.length) {
        return { ...state, storeConfig: action.payload[0] };
      }
      return state;
    }
    case MAGENTO_GET_COUNTRIES: {
      return { ...state, countries: action.payload };
    }
    case MAGENTO_INIT:
      return { ...state, magento: action.payload };
    default:
      return state;
  }
};
