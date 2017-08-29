import {
	MAGENTO_CURRENT_CATEGORY,
	MAGENTO_GET_CATEGORY_PRODUCTS,
	MAGENTO_UPDATE_CONF_PRODUCT
} from '../actions/types';

const INITIAL_STATE = {
  current: false,
  products: {},
	totalCount: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CATEGORY:
      return { ...INITIAL_STATE, current: action.payload };
    case MAGENTO_GET_CATEGORY_PRODUCTS:
      return {
        ...state,
        products: action.payload.items,
				totalCount: action.payload.total_count
      };
		case MAGENTO_UPDATE_CONF_PRODUCT: {
			const { sku, children } = action.payload;
			const products = state.products.map(product => {
				if (product.sku === sku) {
					return {
						...product,
						children,
						price: getPriceFromChildren(children)
					};
				}
				return product;
			});
			return {
					...state,
					products
			};
		}
    default:
      return state;
  }
};

const getPriceFromChildren = products => {
	if (products) {
		const newPrice = products.reduce((minPrice, child) => {
			if (!minPrice) {
				return child.price;
			} else if (minPrice > child.price) {
				return child.price;
			}
			return minPrice;
		}, false);

		return newPrice;
	}

	return 0;
};
