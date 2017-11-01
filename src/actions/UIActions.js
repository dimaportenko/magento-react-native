import {
	UI_PRODUCT_QTY_INPUT,
	UI_PRODUCT_UPDATE_OPTIONS,
	UI_CHECKOUT_EMAIL_CHANGED,
	UI_CHECKOUT_PASSWORD_CHANGED
} from './types';

export const updateProductQtyInput = qty => {
	return {
		type: UI_PRODUCT_QTY_INPUT,
		payload: qty
	};
};

export const uiProductUpdate = selectedOptions => {
	return {
		type: UI_PRODUCT_UPDATE_OPTIONS,
		payload: selectedOptions
	};
};

export const checkoutCustomerEmailChanged = (text) => {
	return {
		type: UI_CHECKOUT_EMAIL_CHANGED,
		payload: text
	};
};

export const checkoutCustomerPasswordChanged = (text) => {
	return {
		type: UI_CHECKOUT_PASSWORD_CHANGED,
		payload: text
	};
};
