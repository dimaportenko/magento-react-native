import {
	MAGENTO_CREATE_CART
} from '../actions/types';

const INITIAL_STATE = {
	cartId: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_CREATE_CART:
			return { ...state };
		default:
			return state;
	}
};
