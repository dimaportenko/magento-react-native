import {
	MAGENTO_CURRENT_CATEGORY,
	MAGENTO_GET_CATEGORY_PRODUCTS
} from '../actions/types';

const INITIAL_STATE = {
  current: false,
  products: {},
	totalCount: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CATEGORY:
      return { ...state, current: action.payload };
    case MAGENTO_GET_CATEGORY_PRODUCTS:
      return {
        ...state,
        products: action.payload.items,
				totalCount: action.payload.total_count
      };
    default:
      return state;
  }
};
