import {
	MAGENTO_GET_COUNTRIES,
	UI_CHECKOUT_EMAIL_CHANGED,
	UI_CHECKOUT_PASSWORD_CHANGED,
	UI_CHECKOUT_POSTCODE_CHANGED,
	UI_CHECKOUT_COUNTRY_CHANGED,
	UI_CHECKOUT_COUNTRY_ID_CHANGED,
	UI_CHECKOUT_FIRSTNAME_CHANGED,
	UI_CHECKOUT_LASTNAME_CHANGED,
	UI_CHECKOUT_TELEPHONE_CHANGED,
	UI_CHECKOUT_CITY_CHANGED,
	UI_CHECKOUT_STREET_CHANGED,
	UI_CHECKOUT_REGION_CHANGED,
	UI_CHECKOUT_ACTIVE_SECTION,
	UI_CHECKOUT_PAYMENT_SELECTED,
	UI_CHECKOUT_SHIPPING_SELECTED,
	UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
	MAGENTO_GET_CART_SHIPPING_METHODS,
	MAGENTO_GET_CART_PAYMENT_METHODS,
	MAGENTO_PLACE_GUEST_CART_ORDER,
	MAGENTO_ADD_SHIPPING_TO_CART
} from '../actions/types';

const INITIAL_STATE = {
	ui: {
		email: 'test+17@test.com',
		password: '',
		// postcode: 'T1A 7L4',
		postcode: '95608',
		country: '',
		countryId: '',
		firstname: 'Test',
		lastname: 'Test',
		telephone: '15417543010',
		street: '7246 W. Windsor Dr. \n',
		city: 'Carmichael',
		region: ''
	},
	selectedShipping: false,
	selectedPayment: false,
	shipping: false,
	payments: false,
	totals: false,
	countries: false,
	orderId: false,
	activeSection: 1
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_GET_CART_SHIPPING_METHODS:
			return { ...state, shipping: action.payload };
		case MAGENTO_GET_CART_PAYMENT_METHODS:
			return { ...state, payments: action.payload };
		case MAGENTO_ADD_SHIPPING_TO_CART: {
			return {
				...state,
				payments: action.payload.payment_methods,
				totals: action.payload.totals
			};
		}
		case MAGENTO_PLACE_GUEST_CART_ORDER:
			return { ...state, orderId: action.payload };
		case MAGENTO_GET_COUNTRIES: {
			const ui = { ...state.ui, countryId: 'US' };
			return { ...state, ui, countries: action.payload };
		}
		case UI_CHECKOUT_EMAIL_CHANGED: {
			const ui = { ...state.ui, email: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_CUSTOMER_NEXT_LOADING: {
			const ui = { ...state.ui, loading: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_PASSWORD_CHANGED: {
			const ui = { ...state.ui, password: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_POSTCODE_CHANGED: {
			const ui = { ...state.ui, postcode: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_COUNTRY_CHANGED: {
			const ui = { ...state.ui, country: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_COUNTRY_ID_CHANGED: {
			const ui = { ...state.ui, countryId: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_FIRSTNAME_CHANGED: {
			const ui = { ...state.ui, firstname: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_LASTNAME_CHANGED: {
			const ui = { ...state.ui, lastname: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_TELEPHONE_CHANGED: {
			const ui = { ...state.ui, telephone: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_CITY_CHANGED: {
			const ui = { ...state.ui, city: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_STREET_CHANGED: {
			const ui = { ...state.ui, street: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_REGION_CHANGED: {
			const ui = { ...state.ui, region: action.payload };
			return { ...state, ui };
		}
		case UI_CHECKOUT_ACTIVE_SECTION:
			return { ...state, activeSection: action.payload };
		case UI_CHECKOUT_SHIPPING_SELECTED:
			return { ...state, selectedShipping: action.payload };
		case UI_CHECKOUT_PAYMENT_SELECTED:
			return { ...state, selectedPayment: action.payload };
		default:
			return state;
	}
};
