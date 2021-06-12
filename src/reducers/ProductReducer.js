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
import * as types from '../actions/types';

const INITIAL_STATE = {
  current: {
    default: {
      product: {},
      attributes: {},
      qtyInput: 1,
      selectedOptions: {},
      selectedCustomOptions: {},
      medias: {},
    },
  },
  relatedProducts: {
    loading: false,
    error: '',
    items: [],
  },
  ratingOptions: [],
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
      current = { ...INITIAL_STATE.current.default, ...current };
      return {
        ...state,
        relatedProducts,
        current: { ...state.current, [current.product.id]: current },
      };
    }
    case MAGENTO_GET_PRODUCT_MEDIA: {
      if (!action.payload.media || !action.payload.media.length) {
        return state;
      }
      const { id, sku, media } = action.payload;
      const medias =
        state.current[id] && state.current[id].medias
          ? state.current[id].media
          : {};
      const current = {
        ...state.current,
        [id]: {
          ...state.current[id],
          medias: {
            ...medias,
            [sku]: media,
          },
        },
      };
      return { ...state, current };
    }
    case MAGENTO_GET_CONF_OPTIONS: {
      const { id, data } = action.payload;
      const current = {
        ...state.current,
        [id]: { ...state.current[id], options: data },
      };
      return { ...state, current };
    }
    case MAGENTO_GET_CUSTOM_OPTIONS: {
      const { id, data } = action.payload;
      const current = {
        ...state.current,
        [id]: { ...state.current[id], customOptions: data },
      };
      return { ...state, current };
    }
    case MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS: {
      const {
        productId: id,
        attributeId,
        options,
        attributeCode,
      } = action.payload;
      const attributes = {
        ...state.current[id].attributes,
        [attributeId]: {
          options,
          attributeCode,
        },
      };
      const current = {
        ...state.current,
        [id]: { ...state.current[id], attributes },
      };
      return { ...state, current };
    }
    case UI_PRODUCT_UPDATE_OPTIONS: {
      const { id, selectedOptions } = action.payload;
      const current = {
        ...state.current,
        [id]: { ...state.current[id], selectedOptions },
      };
      return { ...state, current };
    }
    case UI_PRODUCT_UPDATE_CUSTOM_OPTIONS: {
      const { id, selectedOptions } = action.payload;
      const current = {
        ...state.current,
        [id]: { ...state.current[id], selectedCustomOptions: selectedOptions },
      };
      return { ...state, current };
    }
    case UI_PRODUCT_QTY_INPUT: {
      const { id, qty } = action.payload;
      const current = {
        ...state.current,
        [id]: { ...state.current[id], qtyInput: qty },
      };
      return { ...state, current };
    }
    // case NAVIGATION_GO_TO_SCREEN:
    //   return { ...state, qtyInput: INITIAL_STATE.qtyInput };
    case MAGENTO_UPDATE_CONF_PRODUCT: {
      const { sku, children, id } = action.payload;
      let { current } = state;
      if (
        current[id] &&
        current[id].product &&
        current[id].product.sku === sku
      ) {
        current = {
          ...current,
          [id]: {
            ...current[id],
            product: {
              ...current[id].product,
              children,
              price: getPriceFromChildren(children),
            },
          },
        };
      }

      return { ...state, current };
    }
    case MAGENTO_RELATED_PRODUCTS_LOADING: {
      const relatedProducts = {
        ...state.relatedProducts,
        loading: action.payload,
      };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_SUCCESS: {
      const relatedProducts = {
        ...state.relatedProducts,
        loading: false,
        items: action.payload,
      };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_ERROR: {
      const relatedProducts = {
        ...state.relatedProducts,
        loading: false,
        error: action.payload.errorMessage,
      };
      return {
        ...state,
        relatedProducts,
      };
    }
    case MAGENTO_RELATED_PRODUCTS_CONF_PRODUCT: {
      const { sku, children } = action.payload;

      const items = state.relatedProducts.items.map(product => {
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
    case types.MAGENTO_PRODUCT_RATING_OPTIONS: {
      return { ...state, ratingOptions: action.payload };
    }
    default:
      return state;
  }
};
