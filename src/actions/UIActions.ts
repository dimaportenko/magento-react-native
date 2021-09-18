import {
  MAGENTO_PLACE_GUEST_CART_ORDER,
  UI_PRODUCT_QTY_INPUT,
  UI_PRODUCT_UPDATE_OPTIONS,
  UI_CHECKOUT_ACTIVE_SECTION,
  UI_CHECKOUT_SHIPPING_SELECTED,
  UI_CHECKOUT_PAYMENT_SELECTED,
  UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  UI_CHECKOUT_UPDATE,
  UI_ACCOUNT_CUSTOMER_DATA_UPDATE,
  UI_ACCOUNT_CUSTOMER_DATA_LOADING,
  UI_PRODUCT_UPDATE_CUSTOM_OPTIONS,
  UI_CHANGE_CURRENCY,
  UI_PRODUCT_LIST_TYPE_GRID,
} from './types';
import { ShippingItemType } from '../magento/types';
import { PaymentItemType } from '../reducers/CheckoutReducer';

export const updateProductQtyInput = (qty: string, id: number) => ({
  type: UI_PRODUCT_QTY_INPUT,
  payload: { qty, id },
});

export const uiProductUpdate = (selectedOptions: object, id: number) => ({
  type: UI_PRODUCT_UPDATE_OPTIONS,
  payload: { selectedOptions, id },
});

export const uiProductCustomOptionUpdate = (
  selectedOptions: object,
  id: number,
) => ({
  type: UI_PRODUCT_UPDATE_CUSTOM_OPTIONS,
  payload: { selectedOptions, id },
});

export const checkoutSelectedShippingChanged = (
  shipping: ShippingItemType,
) => ({
  type: UI_CHECKOUT_SHIPPING_SELECTED,
  payload: shipping,
});

export const checkoutSelectedPaymentChanged = (payment: PaymentItemType) => ({
  type: UI_CHECKOUT_PAYMENT_SELECTED,
  payload: payment,
});

export const checkoutCustomerNextLoading = (loading: boolean) => ({
  type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  payload: loading,
});

export const checkoutSetActiveSection = (section: string) => ({
  type: UI_CHECKOUT_ACTIVE_SECTION,
  payload: section,
});

export const checkoutOrderPopupShown = () => ({
  type: MAGENTO_PLACE_GUEST_CART_ORDER,
  payload: false,
});

export const updateCheckoutUI = (key: string, value: unknown) => ({
  type: UI_CHECKOUT_UPDATE,
  payload: { key, value },
});

export const updateAccountAddressUI = (key: string, value: unknown) => ({
  type: UI_ACCOUNT_CUSTOMER_DATA_UPDATE,
  payload: { key, value },
});

export const accountAddressNextLoading = (loading: boolean) => ({
  type: UI_ACCOUNT_CUSTOMER_DATA_LOADING,
  payload: loading,
});

export const changeCurrency = (
  currencyCode: string,
  currencySymbol: string,
  currencyRate: number,
) => ({
  type: UI_CHANGE_CURRENCY,
  payload: {
    currencyCode,
    currencySymbol,
    currencyRate,
  },
});

export const uiProductListTypeGrid = (
  data: boolean,
): {
  type: typeof UI_PRODUCT_LIST_TYPE_GRID;
  payload: boolean;
} => ({
  type: UI_PRODUCT_LIST_TYPE_GRID,
  payload: data,
});
