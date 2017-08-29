import Magento from '../magento';
import { magentoOptions } from '../config/magento';
import {
  MAGENTO_INIT,
  MAGENTO_GET_CATEGORY_TREE,
  MAGENTO_CURRENT_CATEGORY,
	MAGENTO_GET_CATEGORY_PRODUCTS,
	MAGENTO_UPDATE_CONF_PRODUCT
} from './types';

export const initMagento = () => {
  const magento = new Magento(magentoOptions);

  return (dispatch) => {
    magento.init()
      .then(() => {
        dispatch({ type: MAGENTO_INIT, payload: magento });
				magento.getStoreConfig();
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
    magento.getProducts(id, 10)
        .then(payload => {
					dispatch({ type: MAGENTO_GET_CATEGORY_PRODUCTS, payload });
					updateConfigurableProductsPrices(magento, payload.items, dispatch);
				})
        .catch(error => {
					console.log(error);
				});
  };
};

const updateConfigurableProductsPrices = (magento, products, dispatch) => {
  products.forEach(product => {
    if (product.type_id === 'configurable') {
			updateConfigurableProductPrice(magento, product, dispatch);
    }
  });
};

const updateConfigurableProductPrice = (magento, product, dispatch) => {
  const { sku } = product;
	magento.getConfigurableChildren(sku)
			.then(data => {
				dispatch({
          type: MAGENTO_UPDATE_CONF_PRODUCT,
          payload: {
            sku,
						children: data
          }
				});
			})
			.catch(error => {
				console.log(error);
			});
};

export const setCurrentCategory = category => {
  return {
    type: MAGENTO_CURRENT_CATEGORY,
    payload: category
  };
};
