import {
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_GET_ORDERS,
  MAGENTO_UPDATE_REFRESHING_HOME_DATA,
  UI_ACCOUNT_ADDRESS_UPDATE,
  UI_ACCOUNT_ADDRESS_NEXT_LOADING,
  RESET_ACCOUNT_ADDRESS_UI,
  MAGENTO_ADD_ACCOUNT_ADDRESS,
  MAGENTO_GET_COUNTRIES,
} from '../actions/types';

const INITIAL_STATE = {
  customer: null,
  orderData: {
    items: [],
  },
  refreshing: false,
  ui: {
    postcode: '',
    country: '',
    countryId: '',
    street: '',
    city: '',
    region: ''
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UI_ACCOUNT_ADDRESS_UPDATE: {
      const ui = { ...state.ui, [action.payload.key]: action.payload.value };
      return { ...state, ui };
    }
    case UI_ACCOUNT_ADDRESS_NEXT_LOADING: {
      const ui = { ...state.ui, loading: action.payload };
      return { ...state, ui };
    }
    case RESET_ACCOUNT_ADDRESS_UI: {
      return { ...state, ui: INITIAL_STATE.ui }
    }
    case MAGENTO_GET_COUNTRIES: {
      return { ...state, countries: action.payload };
    }
    case MAGENTO_ADD_ACCOUNT_ADDRESS: {
      return { ...state, customer: action.payload };
    }
    case MAGENTO_CURRENT_CUSTOMER:
      return { ...state, customer: action.payload };
    case MAGENTO_GET_ORDERS:
      return { ...state, orderData: action.payload };
    case MAGENTO_UPDATE_REFRESHING_HOME_DATA:
      return {
        ...state,
        refreshing: action.payload,
      };
    default:
      return state;
  }
};
