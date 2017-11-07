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
	UI_CHECKOUT_REGION_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
	ui: {
		email: '',
		password: '',
		postcode: '',
		country: '',
		countryId: '',
		firstname: '',
		lastname: '',
		telephone: '',
		street: '',
		city: '',
		region: ''
	},
	countries: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MAGENTO_GET_COUNTRIES: {
			const ui = { ...state.ui, countryId: 'CA' };
			return { ...state, ui, countries: action.payload };
		}
		case UI_CHECKOUT_EMAIL_CHANGED: {
			const ui = { ...state.ui, email: action.payload };
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
		default:
			return state;
	}
};
