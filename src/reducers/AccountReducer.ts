import {
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_GET_ORDERS,
  UI_ACCOUNT_CUSTOMER_DATA_UPDATE,
  UI_ACCOUNT_CUSTOMER_DATA_LOADING,
  RESET_ACCOUNT_ADDRESS_UI,
  MAGENTO_ADD_ACCOUNT_ADDRESS,
  MAGENTO_UPDATE_REFRESHING_ORDERS_DATA,
  MAGENTO_ORDER_PRODUCT_DETAIL,
  MAGENTO_LOGOUT,
  MAGENTO_ADD_ACCOUNT_ADDRESS_ERROR,
} from '../actions/types';
import { CustomerType, OrderType, ProductType } from '../magento/types';

export type AccountReducerType = {
  customer?: CustomerType;
  orderData: {
    items: OrderType[];
  };
  products: Record<string, ProductType>;
  refreshing: boolean;
  ui: {
    postcode: string;
    country: string;
    countryId: string;
    street: string;
    city: string;
    region:
      | string
      | {
          region: string;
          regionCode: string;
          regionId: number;
        };
    error?: string;
    loading: boolean;
    telephone: string;
  };
};

const INITIAL_STATE: AccountReducerType = {
  customer: undefined,
  orderData: {
    items: [],
  },
  products: {},
  refreshing: false,
  ui: {
    postcode: '',
    country: '',
    countryId: '',
    street: '',
    city: '',
    region: '',
    telephone: '',
    loading: false,
    error: undefined,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UI_ACCOUNT_CUSTOMER_DATA_UPDATE: {
      const ui = { ...state.ui, [action.payload.key]: action.payload.value };
      return { ...state, ui };
    }
    case UI_ACCOUNT_CUSTOMER_DATA_LOADING: {
      const ui = { ...state.ui, loading: action.payload };
      return { ...state, ui };
    }
    case RESET_ACCOUNT_ADDRESS_UI: {
      return { ...state, ui: INITIAL_STATE.ui };
    }
    case MAGENTO_ADD_ACCOUNT_ADDRESS_ERROR: {
      return {
        ...state,
        ui: { ...state.ui, loading: false, error: action.payload },
      };
    }
    case MAGENTO_ADD_ACCOUNT_ADDRESS: {
      return {
        ...state,
        customer: action.payload,
        ui: { ...state.ui, loading: false, error: false },
      };
    }
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
        [sku]: product,
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
