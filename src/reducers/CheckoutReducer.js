import { REHYDRATE } from 'redux-persist/es/constants';
import {
  UI_CHECKOUT_UPDATE,
  UI_CHECKOUT_ACTIVE_SECTION,
  UI_CHECKOUT_PAYMENT_SELECTED,
  UI_CHECKOUT_SHIPPING_SELECTED,
  UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  MAGENTO_GET_CART_SHIPPING_METHODS,
  MAGENTO_GET_CART_PAYMENT_METHODS,
  MAGENTO_PLACE_GUEST_CART_ORDER,
  MAGENTO_ADD_SHIPPING_TO_CART,
  MAGENTO_ERROR_MESSAGE_CART_ORDER,
  MAGENTO_CHECKOUT_TOTALS,
} from '../actions/types';

const INITIAL_STATE = {
  ui: {
    email: '',
    password: '',
    // postcode: 'T1A 7L4',
    postcode: '',
    country: '',
    countryId: '',
    firstname: '',
    lastname: '',
    telephone: '',
    street: '',
    city: '',
    region: '',
  },
  selectedShipping: false,
  selectedPayment: false,
  shipping: false,
  payments: false,
  totals: false,
  countries: false,
  orderId: false,
  activeSection: 1,
  errorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATE:
      return { ...INITIAL_STATE };
    case MAGENTO_GET_CART_SHIPPING_METHODS:
      return { ...state, shipping: action.payload };
    case MAGENTO_GET_CART_PAYMENT_METHODS:
      return { ...state, payments: action.payload };
    case MAGENTO_ADD_SHIPPING_TO_CART: {
      return {
        ...state,
        payments: action.payload.payment_methods,
        totals: action.payload.totals,
      };
    }
    case MAGENTO_CHECKOUT_TOTALS: {
      return { ...state, totals: action.payload };
    }
    case MAGENTO_PLACE_GUEST_CART_ORDER:
      return { ...state, orderId: action.payload };
    case UI_CHECKOUT_UPDATE: {
      const ui = { ...state.ui, [action.payload.key]: action.payload.value };
      return { ...state, ui };
    }
    case UI_CHECKOUT_CUSTOMER_NEXT_LOADING: {
      const ui = { ...state.ui, loading: action.payload };
      return { ...state, ui };
    }
    case UI_CHECKOUT_ACTIVE_SECTION:
      return { ...state, activeSection: action.payload };
    case UI_CHECKOUT_SHIPPING_SELECTED:
      return { ...state, selectedShipping: action.payload };
    case UI_CHECKOUT_PAYMENT_SELECTED:
      return { ...state, selectedPayment: action.payload };
    case MAGENTO_ERROR_MESSAGE_CART_ORDER:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};
