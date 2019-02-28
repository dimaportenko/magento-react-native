import {
  MAGENTO_GET_SEARCH_PRODUCTS
} from '../actions/types';

const INITIAL_STATE = {
  searchInput: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_GET_SEARCH_PRODUCTS: {
      const products = state.searchInput ? state.searchInput : [];
      return {
        ...state,
        searchInput: [...products, ...action.payload.items]
      };
    }
    default:
      return state;
  }
};
