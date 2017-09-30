import {
	MAGENTO_CURRENT_PRODUCT,
	MAGENTO_GET_PRODUCT_MEDIA,
	MAGENTO_GET_CONF_OPTIONS,
	UI_PRODUCT_QTY_INPUT,
	NAVIGATION_GO_TO_SCREEN
} from '../actions/types';

const INITIAL_STATE = {
	current: false,
	qtyInput: 1
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_CURRENT_PRODUCT:
			return { ...state, current: action.payload };
		case MAGENTO_GET_PRODUCT_MEDIA: {
			const current = { ...state.current, media: action.payload };
			return { ...state, current };
		}
		case MAGENTO_GET_CONF_OPTIONS: {
			const current = { ...state.current, options: action.payload };
			return { ...state, current };
		}
		case UI_PRODUCT_QTY_INPUT:
			return { ...state, qtyInput: action.payload };
		case NAVIGATION_GO_TO_SCREEN:
			return { ...state, qtyInput: INITIAL_STATE.qtyInput };
		default:
			return state;
	}
};
