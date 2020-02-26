import * as types from './types';
import { magento } from '../magento';
import { logError } from '../helper/logger';


export const addCouponToCart = (couponCode) => async (dispatch, getState) => {
  dispatch({ type: types.MAGENTO_COUPON_LOADING, payload: true });
  try {
    const cartId = getState().cart?.cartId;
    let totals;
    if (magento.isCustomerLogin()) {
      await magento.admin.addCouponToCart(cartId, couponCode);
      totals = await magento.admin.getCartTotals(cartId);
    } else {
      await magento.guest.addCouponToCart(cartId, couponCode);
      totals = await magento.guest.getCartTotals(cartId);
    }
    dispatch({ type: types.MAGENTO_CHECKOUT_TOTALS, payload: totals });
  } catch (error) {
    dispatch({ type: types.MAGENTO_COUPON_ERROR, payload: error?.message });
    logError(error);
  }
  dispatch({ type: types.MAGENTO_COUPON_LOADING, payload: false });
};

export const removeCouponFromCart = () => async (dispatch, getState) => {
  dispatch({ type: types.MAGENTO_COUPON_LOADING, payload: true });
  const cartId = getState().cart?.cartId;
  try {
    let totals;
    if (magento.isCustomerLogin()) {
      await magento.admin.removeCouponFromCart(cartId);
      totals = await magento.admin.getCartTotals(cartId);
    } else {
      await magento.guest.removeCouponFromCart(cartId);
      totals = await magento.guest.getCartTotals(cartId);
    }
    dispatch({ type: types.MAGENTO_CHECKOUT_TOTALS, payload: totals });
  } catch (error) {
    logError(error);
  }
  dispatch({ type: types.MAGENTO_COUPON_LOADING, payload: false });
};
