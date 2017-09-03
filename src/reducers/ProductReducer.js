import {
	MAGENTO_CURRENT_PRODUCT,
	MAGENTO_GET_PRODUCT_MEDIA
} from '../actions/types';

const INITIAL_STATE = {
	current: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_CURRENT_PRODUCT:
			return { ...state, current: action.payload };
		case MAGENTO_GET_PRODUCT_MEDIA: {
			const current = { ...state.current, media: action.payload };
			return { ...state, current };
		}
		default:
			return state;
	}
};
