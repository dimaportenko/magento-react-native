import { magento } from '../magento';
import { magentoOptions } from '../config/magento';
import {
	MAGENTO_INIT,
	MAGENTO_GET_CATEGORY_TREE,
	MAGENTO_CURRENT_CATEGORY,
	MAGENTO_GET_CATEGORY_PRODUCTS,
	MAGENTO_UPDATE_CONF_PRODUCT,
	MAGENTO_GET_CONF_OPTIONS,
	MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS,
	MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS,
	MAGENTO_CURRENT_PRODUCT,
	MAGENTO_GET_PRODUCT_MEDIA,
	MAGENTO_CREATE_CART,
	MAGENTO_ADD_TO_CART_LOADING,
	MAGENTO_ADD_TO_CART,
	MAGENTO_GET_CART
} from './types';

export const initMagento = () => {
	magento.setOptions(magentoOptions);

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

export const getCategoryTree = () => {
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

export const getProductsForCategory = ({ id, offset }) => {
  return (dispatch) => {
		if (offset) {
			dispatch({ type: MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS, payload: true });
		}
    magento.getProducts(id, 10, offset)
        .then(payload => {
					dispatch({ type: MAGENTO_GET_CATEGORY_PRODUCTS, payload });
					dispatch({ type: MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS, payload: false });
					updateConfigurableProductsPrices(payload.items, dispatch);
				})
        .catch(error => {
					console.log(error);
				});
  };
};

// TODO: add dispatch data
export const getConfigurableProductOptions = (sku) => {
	return (dispatch) => {
		magento.getConfigurableProductOptions(sku)
				.then(data => {
					console.log('product options');
					console.log(data);
					dispatch({ type: MAGENTO_GET_CONF_OPTIONS, payload: data });
					data.forEach(option => {
						magento.getProductAttributesOptions(option.attribute_id)
								.then(attributeOptions => {
									console.log('option attribute');
									console.log(attributeOptions);
									dispatch({
										type: MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS,
										payload: {
											attributeId: option.attribute_id,
											options: attributeOptions
										}
									});
								})
								.catch(error => {
									console.log(error);
								});
					});
				})
				.catch(error => {
					console.log(error);
				});
	};
};

const updateConfigurableProductsPrices = (products, dispatch) => {
  products.forEach(product => {
    if (product.type_id === 'configurable') {
			updateConfigurableProductPrice(product, dispatch);
    }
  });
};

const updateConfigurableProductPrice = (product, dispatch) => {
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

export const getProductMedia = ({ sku }) => {
	return dispatch => {
		magento.getProductMedia(sku)
				.then(data => {
					dispatch({ type: MAGENTO_GET_PRODUCT_MEDIA, payload: data });
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

export const setCurrentProduct = product => {
  return {
    type: MAGENTO_CURRENT_PRODUCT,
    payload: product
  };
};

export const createGuestCart = () => {
  return dispatch => {
		magento.createGuestCart()
				.then(cartId => {
					dispatch({ type: MAGENTO_CREATE_CART, payload: cartId });
				})
				.catch(error => {
					console.log(error);
				});
  };
};

export const addToCartLoading = isLoading => {
	return {
		type: MAGENTO_ADD_TO_CART_LOADING,
		payload: isLoading
	};
};

export const addToCart = ({ cartId, item }) => {
	return dispatch => {
		if (cartId) {
			return dispatchAddToCart(dispatch, cartId, item);
		}
		magento.createGuestCart()
				.then(guestCartId => {
					dispatch({ type: MAGENTO_CREATE_CART, payload: guestCartId });
					const updatedItem = item;
					updatedItem.cartItem.quoteId = guestCartId;
					return dispatchAddToCart(dispatch, guestCartId, updatedItem);
				})
				.catch(error => {
					console.log(error);
				});
	};
};

const dispatchAddToCart = (dispatch, cartId, item) => {
	return magento.addItemToCart(cartId, item)
			.then(data => {
				dispatch({ type: MAGENTO_ADD_TO_CART, payload: data });
				dispatchGetGuestCart(dispatch, cartId);
			})
			.catch(error => {
				console.log(error);
			});
};

const dispatchGetGuestCart = (dispatch, cartId) => {
	return magento.getGuestCart(cartId)
			.then(data => {
				dispatch({ type: MAGENTO_GET_CART, payload: data });
			})
			.catch(error => {
				console.log(error);
			});
};
