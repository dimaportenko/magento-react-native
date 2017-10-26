import {
	UI_PRODUCT_QTY_INPUT,
	UI_PRODUCT_UPDATE_OPTIONS
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
