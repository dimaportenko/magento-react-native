import { MAGENTO_CURRENT_CUSTOMER, MAGENTO_GET_ORDER_PRODUCT_LIST } from '../actions/types';

const INITIAL_STATE = {
  customer: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CUSTOMER:
      return { ...state, customer: action.payload };
    case MAGENTO_GET_ORDER_PRODUCT_LIST:
      return { ...state, customerId: action.payload };
    default:
      return state;
  }
};
