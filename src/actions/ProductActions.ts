import { magento } from '../magento';
import { updateConfigurableProductsPrices } from './RestActions';
import {
  MAGENTO_RELATED_PRODUCTS_LOADING,
  MAGENTO_RELATED_PRODUCTS_CONF_PRODUCT,
  MAGENTO_RELATED_PRODUCTS_SUCCESS,
  MAGENTO_RELATED_PRODUCTS_ERROR,
} from './types';

/**
 * Get product from a category
 */
export const getRelatedProduct = (categoryIds, sku) => async dispatch => {
  try {
    dispatch({ type: MAGENTO_RELATED_PRODUCTS_LOADING, payload: true });
    const result = await magento.admin.getProductsWithAttribute(
      'category_id',
      categoryIds,
      11,
      0,
      false,
      false,
      'in',
    );
    result.items = result.items.filter(product => product.sku !== sku);
    updateConfigurableProductsPrices(
      result.items,
      dispatch,
      MAGENTO_RELATED_PRODUCTS_CONF_PRODUCT,
    );
    if (result && result.items) {
      dispatch({
        type: MAGENTO_RELATED_PRODUCTS_SUCCESS,
        payload: result.items,
      });
    }
  } catch (error) {
    dispatch({
      type: MAGENTO_RELATED_PRODUCTS_ERROR,
      payload: { errorMessage: error.message },
    });
  }
};
