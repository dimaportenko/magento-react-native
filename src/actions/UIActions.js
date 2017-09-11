import {
	UI_PRODUCT_QTY_INPUT
} from './types';

export const updateProductQtyInput = qty => {
	return {
		type: UI_PRODUCT_QTY_INPUT,
		payload: qty
	};
};
