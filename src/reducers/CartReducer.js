import {
	MAGENTO_CREATE_CART,
	MAGENTO_ADD_TO_CART,
	NAVIGATION_GO_TO_SCREEN,
	MAGENTO_ADD_TO_CART_LOADING,
	MAGENTO_GET_CART
} from '../actions/types';

const INITIAL_STATE = {
	cartId: false,
	addToCartLoading: false,
	items: false,
	errorMessage: false,
	cart: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_ADD_TO_CART_LOADING:
			return { ...state, addToCartLoading: action.payload };
		case MAGENTO_CREATE_CART: {
			return { ...state, cartId: action.payload };
		}
		case MAGENTO_ADD_TO_CART:
			return { ...state, addToCartLoading: false, errorMessage: action.payload.message };
		case NAVIGATION_GO_TO_SCREEN:
			return { ...state, errorMessage: false };
		case MAGENTO_GET_CART:
			return { ...state, cart: action.payload };
		default:
			return state;
	}
};
