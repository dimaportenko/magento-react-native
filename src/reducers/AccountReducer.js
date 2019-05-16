import {
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_GET_ORDERS,
  MAGENTO_UPDATE_REFRESHING_ORDERS_DATA
} from '../actions/types';

const INITIAL_STATE = {
  customer: null,
  orderData: {
    items: [],
  },
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CUSTOMER:
      return { ...state, customer: action.payload };
    case MAGENTO_GET_ORDERS:
      return { ...state, orderData: action.payload };
    case MAGENTO_UPDATE_REFRESHING_ORDERS_DATA:
      return {
        ...state,
        refreshing: action.payload,
      };
    default:
      return state;
  }
};
