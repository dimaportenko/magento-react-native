import {
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_GET_ORDERS,
  MAGENTO_UPDATE_REFRESHING_ORDERS_DATA,
  MAGENTO_ORDER_PRODUCT_DETAIL,
  MAGENTO_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {
  customer: null,
  orderData: {
    items: [],
  },
  products: {},
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CUSTOMER:
      return { ...state, customer: action.payload };
    case MAGENTO_GET_ORDERS:
      return { ...state, orderData: action.payload };
      case MAGENTO_LOGOUT:
      return { ...INITIAL_STATE };
    case MAGENTO_UPDATE_REFRESHING_ORDERS_DATA:
      return {
        ...state,
        refreshing: action.payload,
      };
    case MAGENTO_ORDER_PRODUCT_DETAIL: {
      const { sku, product } = action.payload;
      const products = {
        ...state.products,
        [sku]: product
      };
      return {
        ...state,
        products,
      };
    }
    default:
      return state;
  }
};
