import {
	UI_CHECKOUT_EMAIL_CHANGED,
	UI_CHECKOUT_PASSWORD_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
	ui: {
		email: '',
		password: '',
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UI_CHECKOUT_EMAIL_CHANGED: {
			const ui = { ...state.ui, email: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_PASSWORD_CHANGED: {
			const ui = { ...state.ui, password: action.payload };
			return { ...state, ui };
		}
		default:
			return state;
	}
};
