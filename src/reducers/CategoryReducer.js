import { getPriceFromChildren } from '../helper/product';
import {
  MAGENTO_CURRENT_CATEGORY,
  MAGENTO_RESET_CATEGORY_PRODUCTS,
  MAGENTO_GET_CATEGORY_PRODUCTS,
  MAGENTO_UPDATE_CONF_PRODUCT,
  MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS,
  MAGENTO_UPDATE_CATEGORY_PRODUCTS,
  MAGENTO_UPDATE_REFRESHING_CATEGORY_PRODUCTS,
  MAGENTO_GET_FILTERED_PRODUCTS,
} from '../actions/types';

const INITIAL_STATE = {
  current: false,
  products: false,
  totalCount: 0,
  loadingMore: false,
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CATEGORY:
      return { ...INITIAL_STATE, current: action.payload };
    case MAGENTO_RESET_CATEGORY_PRODUCTS:
      return {
        ...state,
        products: false,
        loadingMore: false,
        totalCount: false,
      };
    case MAGENTO_GET_CATEGORY_PRODUCTS: {
      const products = state.products ? state.products : [];
      return {
        ...state,
        products: [...products, ...action.payload.items],
        totalCount: action.payload.total_count,
      };
    }
    case MAGENTO_GET_FILTERED_PRODUCTS: {
      return {
        ...state,
        products: action.payload.items,
        totalCount: action.payload.total_count,
      };
    }
    case MAGENTO_UPDATE_CATEGORY_PRODUCTS: {
      return {
        ...state,
        products: action.payload.items,
        totalCount: action.payload.total_count,
      };
    }
    case MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS:
      return {
        ...state,
        loadingMore: action.payload,
      };
    case MAGENTO_UPDATE_REFRESHING_CATEGORY_PRODUCTS:
      return {
        ...state,
        refreshing: action.payload,
      };
    case MAGENTO_UPDATE_CONF_PRODUCT: {
      const { sku, children } = action.payload;
      const products = state.products.map(product => {
        if (product.sku === sku) {
          return {
            ...product,
            children,
            price: getPriceFromChildren(children),
          };
        }
        return product;
      });
      return {
        ...state,
        products,
      };
    }
    default:
      return state;
  }
};
