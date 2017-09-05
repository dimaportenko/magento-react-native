import {
	MAGENTO_CREATE_CART,
	MAGENTO_ADD_TO_CART,
	MAGENTO_ADD_TO_CART_LOADING
} from '../actions/types';

const INITIAL_STATE = {
	cartId: false,
	addToCartLoading: false,
	items: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_ADD_TO_CART_LOADING:
			return { ...state, addToCartLoading: action.payload };
		case MAGENTO_CREATE_CART:
			return { ...state, cartId: action.payload };
		case MAGENTO_ADD_TO_CART:
			return { ...state, addToCartLoading: false, items: action.payload };
		default:
			return state;
	}
};
