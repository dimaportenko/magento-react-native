import { GUEST_TYPE } from '../../types';
import { Magento } from '../../index';
import {
  AddToCartItemApiParamType,
  CartPaymentApiParamType,
  CustomerAddressApiParamType,
} from '../types';

export type CustomerSignInType = {
  customer: {
    email: string;
    firstname: string;
    lastname: string;
  };
  password: string;
};

export default (magento: Magento) => ({
  createGuestCart: () => magento.post('/V1/guest-carts', undefined, GUEST_TYPE),

  addItemToCart: (cartId: string, item: AddToCartItemApiParamType) =>
    magento.post(`/V1/guest-carts/${cartId}/items`, item, GUEST_TYPE),

  getGuestCart: (cartId: string) =>
    magento.get(`/V1/guest-carts/${cartId}`, undefined, undefined, GUEST_TYPE),

  addCouponToCart: (cartId: string, couponCode: string) =>
    magento.put(
      `/V1/guest-carts/${cartId}/coupons/${couponCode}`,
      undefined,
      GUEST_TYPE,
    ),

  removeCouponFromCart: (cartId: string) =>
    magento.delete(`/V1/guest-carts/${cartId}/coupons`, undefined, GUEST_TYPE),

  getCartTotals: (cartId: string) =>
    magento.get(
      `/V1/guest-carts/${cartId}/totals`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  addGuestCartBillingAddress: (
    cartId: string,
    address: CustomerAddressApiParamType,
  ) =>
    magento.post(
      `/V1/guest-carts/${cartId}/billing-address`,
      address,
      GUEST_TYPE,
    ),

  guestCartEstimateShippingMethods: (
    cartId: string,
    address: CustomerAddressApiParamType,
  ) =>
    magento.post(
      `/V1/guest-carts/${cartId}/estimate-shipping-methods`,
      address,
      GUEST_TYPE,
    ),

  addGuestCartShippingInfo: (
    cartId: string,
    address: CustomerAddressApiParamType,
  ) =>
    magento.post(
      `/V1/guest-carts/${cartId}/shipping-information`,
      address,
      GUEST_TYPE,
    ),

  getGuestCartPaymentInfo: (cartId: string) =>
    magento.get(
      `/V1/guest-carts/${cartId}/payment-information`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  getGuestCartPaymentMethods: (cartId: string) =>
    magento.get(
      `/V1/guest-carts/${cartId}/payment-methods`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  getGuestCartShippingMethods: (cartId: string) =>
    magento.get(
      `/V1/guest-carts/${cartId}/shipping-methods`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  placeGuestCartOrder: (cartId: string, payment: CartPaymentApiParamType) =>
    magento.put(`/V1/guest-carts/${cartId}/order`, payment, GUEST_TYPE),

  getCountries: () =>
    magento.get('/V1/directory/countries', undefined, undefined, GUEST_TYPE),

  getCountriesByCountryId: (countryId: string) =>
    magento.get(
      `/V1/directory/countries/${countryId}`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  createCustomer: (customer: CustomerSignInType) =>
    magento.post('/V1/customers', customer, GUEST_TYPE),

  auth: (username: string, password: string) => {
    if (username) {
      const path = '/V1/integration/customer/token';
      return magento.post(path, { username, password }, GUEST_TYPE);
    }
    throw new Error('Email is required!');
  },

  initiatePasswordReset: (email: string) => {
    // PUT /V1/customers/password
    const data = {
      email,
      template: 'email_reset',
      websiteId: magento?.configuration?.websiteId,
    };

    const path = '/V1/customers/password';
    return magento.put(path, data, GUEST_TYPE);
  },

  getCurrency: () =>
    magento.get('/V1/directory/currency', undefined, undefined, GUEST_TYPE),
});
