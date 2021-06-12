import { GUEST_TYPE } from '../../types';

export default magento => ({
  createGuestCart: () => magento.post('/V1/guest-carts', undefined, GUEST_TYPE),

  addItemToCart: (cartId, item) =>
    magento.post(`/V1/guest-carts/${cartId}/items`, item, GUEST_TYPE),

  getGuestCart: cartId =>
    magento.get(`/V1/guest-carts/${cartId}`, undefined, undefined, GUEST_TYPE),

  addCouponToCart: (cartId, couponCode) =>
    magento.put(
      `/V1/guest-carts/${cartId}/coupons/${couponCode}`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  removeCouponFromCart: cartId =>
    magento.delete(`/V1/guest-carts/${cartId}/coupons`, undefined, GUEST_TYPE),

  getCartTotals: cartId =>
    magento.get(
      `/V1/guest-carts/${cartId}/totals`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  addGuestCartBillingAddress: (cartId, address) =>
    magento.post(
      `/V1/guest-carts/${cartId}/billing-address`,
      address,
      GUEST_TYPE,
    ),

  guestCartEstimateShippingMethods: (cartId, address) =>
    magento.post(
      `/V1/guest-carts/${cartId}/estimate-shipping-methods`,
      address,
      GUEST_TYPE,
    ),

  addGuestCartShippingInfo: (cartId, address) =>
    magento.post(
      `/V1/guest-carts/${cartId}/shipping-information`,
      address,
      GUEST_TYPE,
    ),

  getGuestCartPaymentInfo: cartId =>
    magento.get(
      `/V1/guest-carts/${cartId}/payment-information`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  getGuestCartPaymentMethods: cartId =>
    magento.get(
      `/V1/guest-carts/${cartId}/payment-methods`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  getGuestCartShippingMethods: cartId =>
    magento.get(
      `/V1/guest-carts/${cartId}/shipping-methods`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  placeGuestCartOrder: (cartId, payment) =>
    magento.put(`/V1/guest-carts/${cartId}/order`, payment, GUEST_TYPE),

  getCountries: () =>
    magento.get('/V1/directory/countries', undefined, undefined, GUEST_TYPE),

  getCountriesByCountryId: countryId =>
    magento.get(
      `/V1/directory/countries/${countryId}`,
      undefined,
      undefined,
      GUEST_TYPE,
    ),

  createCustomer: customer =>
    magento.post('/V1/customers', customer, GUEST_TYPE),

  auth: (username, password) => {
    if (username) {
      const path = '/V1/integration/customer/token';
      return magento.post(path, { username, password }, GUEST_TYPE);
    }
    throw new Error('Email is required!');
  },

  initiatePasswordReset: email => {
    // PUT /V1/customers/password
    const data = {
      email,
      template: 'email_reset',
      websiteId: magento.configuration.websiteId,
    };

    const path = '/V1/customers/password';
    return magento.put(path, data, GUEST_TYPE);
  },

  getCurrency: () =>
    magento.get('/V1/directory/currency', undefined, undefined, GUEST_TYPE),
});
