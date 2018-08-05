import {
	MAGENTO_PLACE_GUEST_CART_ORDER,
	UI_PRODUCT_QTY_INPUT,
	UI_PRODUCT_UPDATE_OPTIONS,
	UI_CHECKOUT_ACTIVE_SECTION,
	UI_CHECKOUT_SHIPPING_SELECTED,
	UI_CHECKOUT_PAYMENT_SELECTED,
	UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  UI_CHECKOUT_UPDATE,
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

export const checkoutSelectedShippingChanged = (shipping) => {
	return {
		type: UI_CHECKOUT_SHIPPING_SELECTED,
		payload: shipping
	};
};

export const checkoutSelectedPaymentChanged = (payment) => {
	return {
		type: UI_CHECKOUT_PAYMENT_SELECTED,
		payload: payment
	};
};

export const checkoutCustomerNextLoading = (loading) => {
	return {
		type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
		payload: loading
	};
};

export const checkoutSetActiveSection = (section) => {
	return {
		type: UI_CHECKOUT_ACTIVE_SECTION,
		payload: section
	};
};

export const checkoutOrderPopupShown = () => {
	return {
		type: MAGENTO_PLACE_GUEST_CART_ORDER,
		payload: false
	};
};

export const updateCheckoutUI = (key, value) => {
  return {
    type: UI_CHECKOUT_UPDATE,
    payload: { key, value }
  };
};
