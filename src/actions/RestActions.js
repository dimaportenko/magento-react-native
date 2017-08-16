import Magento from '../magento';
import { magentoOptions } from '../config/magento';
import {
  MAGENTO_INIT,
  MAGENTO_GET_CATEGORY_TREE
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
