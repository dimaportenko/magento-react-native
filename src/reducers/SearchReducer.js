import {
  MAGENTO_GET_SEARCH_PRODUCTS,
  MAGENTO_LOAD_MORE_SEARCH_PRODUCTS,
  MAGENTO_UPDATE_SEARCH_CONF_PRODUCT,
  MAGENTO_RESET_SEARCH_PRODUCTS,
} from '../actions/types';
import { getPriceFromChildren } from '../helper/product';

const INITIAL_STATE = {
  products: [],
  searchInput: null,
  totalCount: null,
  loadingMore: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_RESET_SEARCH_PRODUCTS:
      return {
        ...state,
        searchInput: null,
        products: [],
        totalCount: null,
        loadingMore: null,
      };
    case MAGENTO_GET_SEARCH_PRODUCTS: {
      if (state.searchInput === action.payload.searchInput) {
        return {
          searchInput: action.payload.searchInput,
          products: [...state.products, ...action.payload.data.items],
          totalCount: action.payload.data.total_count,
        };
      }
      return {
        searchInput: action.payload.searchInput,
        products: [...action.payload.data.items],
        totalCount: action.payload.data.total_count,
      };
    }
    case MAGENTO_UPDATE_SEARCH_CONF_PRODUCT: {
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
    case MAGENTO_LOAD_MORE_SEARCH_PRODUCTS: {
      return {
        ...state,
        loadingMore: action.payload,
      };
    }
    default:
      return state;
  }
};
