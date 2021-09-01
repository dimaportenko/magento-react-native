import { REHYDRATE } from 'redux-persist/es/constants';
import {
  UI_CHECKOUT_UPDATE,
  UI_CHECKOUT_ACTIVE_SECTION,
  UI_CHECKOUT_PAYMENT_SELECTED,
  UI_CHECKOUT_SHIPPING_SELECTED,
  UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  MAGENTO_GET_CART_SHIPPING_METHODS,
  MAGENTO_GET_CART_PAYMENT_METHODS,
  MAGENTO_PLACE_GUEST_CART_ORDER,
  MAGENTO_ADD_SHIPPING_TO_CART,
  MAGENTO_ERROR_MESSAGE_CART_ORDER,
  MAGENTO_CHECKOUT_TOTALS,
} from '../actions/types';
import { RegionType, ShippingItemType } from '../magento/types';

export type PaymentItemType = {
  code: string;
  title: string;
};

export type TotalsType = {
  base_currency_code: string;
  coupon_code?: string;
  // base_discount_amount: 0
  base_grand_total: number;
  // base_shipping_amount: 5
  // base_shipping_discount_amount: 0
  base_shipping_incl_tax: number;
  // base_shipping_tax_amount: 0
  base_subtotal: number;
  // base_subtotal_with_discount: 32
  // base_tax_amount: 0
  discount_amount: number;
  // grand_total: 37
  // items: Array(1)
  // items_qty: 1
  // quote_currency_code: "USD"
  // shipping_amount: 5
  // shipping_discount_amount: 0
  // shipping_incl_tax: 5
  // shipping_tax_amount: 0
  // subtotal: 32
  // subtotal_incl_tax: 32
  // subtotal_with_discount: 32
  // tax_amount: 0
  // total_segments: Array(4)
  // weee_tax_applied_amount: null
};

export type CheckoutReducerType = {
  ui: {
    email: string;
    password: string;
    postcode: string;
    country: string;
    countryId: string;
    firstname: string;
    lastname: string;
    telephone: string;
    street: string;
    city: string;
    region:
      | string
      | {
          region: string;
          regionCode: string;
          regionId: number;
        };
    loading: boolean;
  };
  selectedShipping?: ShippingItemType;
  selectedPayment?: PaymentItemType;
  shipping?: ShippingItemType[];
  payments?: PaymentItemType[];
  totals?: TotalsType;
  countries: boolean;
  orderId: boolean;
  activeSection: number;
  errorMessage: string;
};

const INITIAL_STATE: CheckoutReducerType = {
  ui: {
    email: '',
    password: '',
    // postcode: 'T1A 7L4',
    postcode: '',
    country: '',
    countryId: '',
    firstname: '',
    lastname: '',
    telephone: '',
    street: '',
    city: '',
    region: '',
    loading: false,
  },
  selectedShipping: undefined,
  selectedPayment: undefined,
  shipping: undefined,
  payments: undefined,
  totals: undefined,
  countries: false,
  orderId: false,
  activeSection: 1,
  errorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATE:
      return { ...INITIAL_STATE };
    case MAGENTO_GET_CART_SHIPPING_METHODS:
      return { ...state, shipping: action.payload };
    case MAGENTO_GET_CART_PAYMENT_METHODS:
      return { ...state, payments: action.payload };
    case MAGENTO_ADD_SHIPPING_TO_CART: {
      return {
        ...state,
        payments: action.payload.payment_methods,
        totals: action.payload.totals,
      };
    }
    case MAGENTO_CHECKOUT_TOTALS: {
      return { ...state, totals: action.payload };
    }
    case MAGENTO_PLACE_GUEST_CART_ORDER:
      return { ...state, orderId: action.payload };
    case UI_CHECKOUT_UPDATE: {
      const ui = { ...state.ui, [action.payload.key]: action.payload.value };
      return { ...state, ui };
    }
    case UI_CHECKOUT_CUSTOMER_NEXT_LOADING: {
      const ui = { ...state.ui, loading: action.payload };
      return { ...state, ui };
    }
    case UI_CHECKOUT_ACTIVE_SECTION:
      return { ...state, activeSection: action.payload };
    case UI_CHECKOUT_SHIPPING_SELECTED:
      return { ...state, selectedShipping: action.payload };
    case UI_CHECKOUT_PAYMENT_SELECTED:
      return { ...state, selectedPayment: action.payload };
    case MAGENTO_ERROR_MESSAGE_CART_ORDER:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};
