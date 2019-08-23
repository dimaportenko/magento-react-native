import _ from 'lodash';
import { getPriceFromChildren } from '../helper/product';
import {
  HOME_SCREEN_DATA,
  MAGENTO_GET_FEATURED_PRODUCTS,
  MAGENTO_UPDATE_FEATURED_CONF_PRODUCT,
  MAGENTO_UPDATE_REFRESHING_HOME_DATA,
} from '../actions/types';

const INITIAL_STATE = {
  slider: [],
  featuredProducts: {},
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_UPDATE_FEATURED_CONF_PRODUCT: {
      const { sku, children } = action.payload;

      let featuredProducts = {};
      _.forEach(state.featuredProducts, (products, categoryId) => {
        const items = products.items.map((product) => {
          if (product.sku === sku) {
            return {
              ...product,
              children,
              price: getPriceFromChildren(children),
            };
          }
          return product;
        });

        featuredProducts = { ...featuredProducts, [categoryId]: { ...products, items } };
      });

      return { ...state, featuredProducts };
    }
    case MAGENTO_GET_FEATURED_PRODUCTS: {
      const { categoryId, products } = action.payload;
      const featuredProducts = { ...state.featuredProducts, [categoryId]: products };
      return { ...state, featuredProducts };
    }
    case HOME_SCREEN_DATA:
      return { ...state, ...action.payload };
    case MAGENTO_UPDATE_REFRESHING_HOME_DATA:
      return {
        ...state,
        refreshing: action.payload,
      };
    default:
      return state;
  }
};
