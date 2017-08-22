import Magento from '../magento';
import { magentoOptions } from '../config/magento';
import {
  MAGENTO_INIT,
  MAGENTO_GET_CATEGORY_TREE,
  MAGENTO_CURRENT_CATEGORY,
	MAGENTO_GET_CATEGORY_PRODUCTS
} from './types';

export const initMagento = () => {
  const magento = new Magento(magentoOptions);

  return (dispatch) => {
    magento.init()
      .then(() => {
        dispatch({ type: MAGENTO_INIT, payload: magento });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const getCategoryTree = magento => {
  return (dispatch) => {
    magento.getCategoriesTree()
      .then(payload => {
        dispatch({ type: MAGENTO_GET_CATEGORY_TREE, payload });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const getProductsForCategory = ({ id, magento }) => {
  return (dispatch) => {
    magento.getProducts()
        .then(payload => {
					dispatch({ type: MAGENTO_GET_CATEGORY_PRODUCTS, payload });
				})
        .catch(error => {
					console.log(error);
				});
  };
};

export const setCurrentCategory = category => {
  return {
    type: MAGENTO_CURRENT_CATEGORY,
    payload: category
  };
};
