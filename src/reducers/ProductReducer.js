import {
  MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS,
  MAGENTO_CURRENT_PRODUCT,
  MAGENTO_GET_PRODUCT_MEDIA,
  MAGENTO_GET_CONF_OPTIONS,
  UI_PRODUCT_UPDATE_OPTIONS,
  UI_PRODUCT_QTY_INPUT,
  NAVIGATION_GO_TO_SCREEN,
  MAGENTO_GET_CUSTOM_OPTIONS,
  UI_PRODUCT_UPDATE_CUSTOM_OPTIONS,
  MAGENTO_UPDATE_CONF_PRODUCT,
  MAGENTO_RELATED_PRODUCTS_LOADING,
  MAGENTO_RELATED_PRODUCTS_SUCCESS,
  MAGENTO_RELATED_PRODUCTS_ERROR,
  MAGENTO_RELATED_PRODUCTS_CONF_PRODUCT,
} from '../actions/types';
import { getPriceFromChildren } from '../helper/product';

const INITIAL_STATE = {
  current: false,
  attributes: {},
  qtyInput: 1,
  selectedOptions: {},
  selectedCustomOptions: {},
  relatedProducts: {
    loading: false,
    error: '',
    items: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_PRODUCT: {
      let current = action.payload;
      const relatedProducts = {
        loading: false,
        error: null,
        items: [],
      };
      if (current && state.current && state.current.product && state.current.product.id === action.payload.product.id) {
        current = { ...state.current, ...current };
      }
      return { ...state, relatedProducts, selectedOptions: {}, current };
    }
    case MAGENTO_GET_PRODUCT_MEDIA: {
      if (!action.payload.media || !action.payload.media.length) {
        return state;
      }
      const medias = state.current && state.current.medias ? state.current.media : {};
      const current = {
        ...state.current,
        medias: {
          ...medias, [action.payload.sku]: action.payload.media,
        },
      };
      return { ...state, current };
    }
    case MAGENTO_GET_CONF_OPTIONS: {
      const current = { ...state.current, options: action.payload };
      return { ...state, current };
    }
    case MAGENTO_GET_CUSTOM_OPTIONS: {
      const current = { ...state.current, customOptions: action.payload };
      return { ...state, current };
    }
    case MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS: {
      const attributes = {
        ...state.attributes,
        [action.payload.attributeId]: {
          options: action.payload.options,
          attributeCode: action.payload.attributeCode,
        },
      };
      return { ...state, attributes };
    }
    case UI_PRODUCT_UPDATE_OPTIONS: {
      return { ...state, selectedOptions: action.payload };
    }
    case UI_PRODUCT_UPDATE_CUSTOM_OPTIONS: {
      return { ...state, selectedCustomOptions: action.payload };
    }
    case UI_PRODUCT_QTY_INPUT:
      return { ...state, qtyInput: action.payload };
    case NAVIGATION_GO_TO_SCREEN:
      return { ...state, qtyInput: INITIAL_STATE.qtyInput };
    case MAGENTO_UPDATE_CONF_PRODUCT: {
      const { sku, children } = action.payload;
      let { current } = state;
      if (current && current.product && current.product.sku === sku) {
        current = { ...current, product: { ...current.product, children } };
      }

      return { ...state, current };
    }
    case MAGENTO_RELATED_PRODUCTS_LOADING: {
      const relatedProducts = { ...state.relatedProducts, loading: action.payload };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_SUCCESS: {
      const relatedProducts = { ...state.relatedProducts, loading: false, items: action.payload };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_ERROR: {
      const relatedProducts = { ...state.relatedProducts, loading: false, error: action.payload.errorMessage };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_CONF_PRODUCT: {
      const { sku, children } = action.payload;

      const items = state.relatedProducts.items.map((product) => {
        if (product.sku === sku) {
          return {
            ...product,
            children,
            price: getPriceFromChildren(children),
          };
        }
        return product;
      });

      const relatedProducts = { ...state.relatedProducts, items };
      return {
        ...state,
        relatedProducts,
      };
    }
    default:
      return state;
  }
};
