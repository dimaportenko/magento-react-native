import {
  MAGENTO_PASSWORD_RESET_LOADING,
  MAGENTO_CREATE_CUSTOMER,
  MAGENTO_AUTH_LOADING,
  MAGENTO_AUTH,
  MAGENTO_AUTH_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  customer: null,
  token: null,
  error: null,
  success: null,
  loading: false,
  reset_loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_PASSWORD_RESET_LOADING:
      return { ...state, reset_loading: action.payload };
    case MAGENTO_CREATE_CUSTOMER:
      return { ...state, customer: action.payload };
    case MAGENTO_AUTH:
      return { ...state, token: action.payload };
    case MAGENTO_AUTH_ERROR:
      return { ...state, error: action.payload };
    case MAGENTO_AUTH_LOADING: {
      if (action.payload) {
        return {
          ...state,
          loading: action.payload,
          error: null,
          success: null
        };
      }
      return { ...state, loading: action.payload };
    }
    default:
      return state;
  }
};
