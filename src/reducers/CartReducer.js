import {
  MAGENTO_CREATE_CART,
  MAGENTO_ADD_TO_CART,
  NAVIGATION_GO_TO_SCREEN,
  MAGENTO_ADD_TO_CART_LOADING,
  MAGENTO_GET_CART,
  MAGENTO_CART_ITEM_PRODUCT,
  MAGENTO_REMOVE_FROM_CART_LOADING,
  MAGENTO_REMOVE_FROM_CART,
  MAGENTO_UPDATE_REFRESHING_CART_ITEM_PRODUCT,
  MAGENTO_LOGOUT,
  MAGENTO_CURRENT_PRODUCT,
  MAGENTO_LOGIN_SUCCESS,
  MAGENTO_COUPON_LOADING,
  MAGENTO_COUPON_ERROR, MAGENTO_CART_RESET,
} from '../actions/types';

const INITIAL_STATE = {
  cartId: false,
  addToCartLoading: false,
  items: false,
  errorMessage: false,
  cart: {},
  products: {},
  refreshing: false,
  removingItemId: false,
  couponLoading: false,
  couponError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_ADD_TO_CART_LOADING:
      return { ...state, addToCartLoading: action.payload };
    case MAGENTO_CREATE_CART:
      return { ...state, cartId: action.payload, quote: { items: [] } };
    case MAGENTO_CART_ITEM_PRODUCT: {
      const products = {
        ...state.products,
        [action.payload.sku]: action.payload,
      };
      return { ...state, products };
    }
    case MAGENTO_CURRENT_PRODUCT:
      return { ...state, errorMessage: false };
    case MAGENTO_LOGOUT:
    case MAGENTO_CART_RESET:
      return { ...INITIAL_STATE };
    case MAGENTO_ADD_TO_CART:
      return {
        ...state,
        addToCartLoading: false,
        errorMessage: action.payload.message,
      };
    case NAVIGATION_GO_TO_SCREEN:
      return { ...state, errorMessage: false };
    case MAGENTO_GET_CART:
      return { ...state, couponError: '', quote: action.payload };
    case MAGENTO_REMOVE_FROM_CART_LOADING:
      return { ...state, removingItemId: action.payload };
    case MAGENTO_REMOVE_FROM_CART:
      return { ...state, errorMessage: action.payload.message };
    case MAGENTO_UPDATE_REFRESHING_CART_ITEM_PRODUCT:
      return {
        ...state,
        refreshing: action.payload,
      };
    case MAGENTO_LOGIN_SUCCESS: {
      return { ...state, cartId: false, quote: { items: [] } };
    }
    case MAGENTO_COUPON_LOADING:
      const couponError = action.payload ? '' : state.couponError;
      return { ...state, couponLoading: action.payload, couponError };
    case MAGENTO_COUPON_ERROR:
      return { ...state, couponError: action.payload };
    default:
      return state;
  }
};
