import { CUSTOMER_TYPE } from '../../types';
import { Magento } from '../../index';
import {
  AddToCartItemApiParamType,
  CartPaymentApiParamType,
  CustomerAddressApiParamType,
  PostReviewDataApiParamType,
} from '../types';

export default (magento: Magento) => ({
  getCurrentCustomer: () =>
    magento.get('/V1/customers/me', undefined, undefined, CUSTOMER_TYPE),

  getCustomerCart: () =>
    magento.get('/V1/carts/mine', undefined, undefined, CUSTOMER_TYPE),

  createCart: (customerId: number) =>
    magento.post(`/V1/customers/${customerId}/carts`, undefined, CUSTOMER_TYPE),

  addItemToCart: (item: AddToCartItemApiParamType) =>
    magento.post('/V1/carts/mine/items', item, CUSTOMER_TYPE),

  addCartBillingAddress: (address: CustomerAddressApiParamType) =>
    magento.post('/V1/carts/mine/billing-address', address, CUSTOMER_TYPE),

  cartEstimateShippingMethods: (address: CustomerAddressApiParamType) =>
    magento.post(
      '/V1/carts/mine/estimate-shipping-methods',
      address,
      CUSTOMER_TYPE,
    ),

  addCartShippingInfo: (address: CustomerAddressApiParamType) =>
    magento.post('/V1/carts/mine/shipping-information', address, CUSTOMER_TYPE),

  getCartShippingMethods: () =>
    magento.get(
      '/V1/carts/mine/estimate-shipping-methods',
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),

  getCartPaymentMethods: () =>
    magento.get(
      '/V1/carts/mine/payment-methods',
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),

  placeCartOrder: (payment: CartPaymentApiParamType) =>
    magento.put('/V1/carts/mine/order', payment, CUSTOMER_TYPE),

  postReview: (review: PostReviewDataApiParamType) =>
    magento.post('/V1/mma/review/mine/post', review, CUSTOMER_TYPE),
});
