import {
	MAGENTO_PLACE_GUEST_CART_ORDER,
	UI_PRODUCT_QTY_INPUT,
	UI_PRODUCT_UPDATE_OPTIONS,
	UI_CHECKOUT_EMAIL_CHANGED,
	UI_CHECKOUT_PASSWORD_CHANGED,
	UI_CHECKOUT_POSTCODE_CHANGED,
	UI_CHECKOUT_COUNTRY_CHANGED,
	UI_CHECKOUT_COUNTRY_ID_CHANGED,
	UI_CHECKOUT_FIRSTNAME_CHANGED,
	UI_CHECKOUT_LASTNAME_CHANGED,
	UI_CHECKOUT_TELEPHONE_CHANGED,
	UI_CHECKOUT_CITY_CHANGED,
	UI_CHECKOUT_ACTIVE_SECTION,
	UI_CHECKOUT_STREET_CHANGED,
	UI_CHECKOUT_REGION_CHANGED,
	UI_CHECKOUT_SHIPPING_SELECTED,
	UI_CHECKOUT_PAYMENT_SELECTED,
	UI_CHECKOUT_CUSTOMER_NEXT_LOADING
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

export const checkoutCustomerPostcodeChanged = (text) => {
	return {
		type: UI_CHECKOUT_POSTCODE_CHANGED,
		payload: text
	};
};

export const checkoutCustomerCountryChanged = (text) => {
	return {
		type: UI_CHECKOUT_COUNTRY_CHANGED,
		payload: text
	};
};

export const checkoutCustomerCountryIdChanged = (text) => {
	return {
		type: UI_CHECKOUT_COUNTRY_ID_CHANGED,
		payload: text
	};
};

export const checkoutCustomerFirstnameChanged = (text) => {
	return {
		type: UI_CHECKOUT_FIRSTNAME_CHANGED,
		payload: text
	};
};

export const checkoutCustomerLastnameChanged = (text) => {
	return {
		type: UI_CHECKOUT_LASTNAME_CHANGED,
		payload: text
	};

};
export const checkoutCustomerTelephoneChanged = (text) => {
	return {
		type: UI_CHECKOUT_TELEPHONE_CHANGED,
		payload: text
	};
};

export const checkoutCustomerCityChanged = (text) => {
	return {
		type: UI_CHECKOUT_CITY_CHANGED,
		payload: text
	};
};

export const checkoutCustomerStreetChanged = (text) => {
	return {
		type: UI_CHECKOUT_STREET_CHANGED,
		payload: text
	};
};

export const checkoutCustomerRegionChanged = (text) => {
	return {
		type: UI_CHECKOUT_REGION_CHANGED,
		payload: text
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
