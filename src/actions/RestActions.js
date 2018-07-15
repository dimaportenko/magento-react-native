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
	MAGENTO_ADD_CART_BILLING_ADDRESS,
	MAGENTO_GET_CART_SHIPPING_METHODS,
	MAGENTO_GET_CART_PAYMENT_METHODS,
	MAGENTO_PLACE_GUEST_CART_ORDER,
	MAGENTO_ADD_SHIPPING_TO_CART,
	MAGENTO_ADD_TO_CART,
	MAGENTO_GET_CART,
	MAGENTO_CART_ITEM_PRODUCT,
	MAGENTO_GET_COUNTRIES,
	MAGENTO_CREATE_CUSTOMER,
	UI_CHECKOUT_ACTIVE_SECTION,
	UI_CHECKOUT_CUSTOMER_NEXT_LOADING
} from './types';

export const initMagento = () => {
	magento.setOptions(magentoOptions);

  return (dispatch) => {
    magento.init()
      .then(() => {
        dispatch({ type: MAGENTO_INIT, payload: magento });
				magento.admin.getStoreConfig();
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

export const getConfigurableProductOptions = (sku) => {
	return (dispatch) => {
		magento.getConfigurableProductOptions(sku)
				.then(data => {
					console.log('product options');
					console.log(data);
					dispatch({ type: MAGENTO_GET_CONF_OPTIONS, payload: data });
					data.forEach(option => {
						magento.getAttributeByCode(option.attribute_id)
								.then(attributeOptions => {
									console.log('option attribute');
									console.log(attributeOptions);
									dispatch({
										type: MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS,
										payload: {
											attributeId: option.attribute_id,
											options: attributeOptions.options,
											attributeCode: attributeOptions.attribute_code
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

export const cartItemProduct = sku => {
	return dispatch => {
		magento.getProductBySku(sku)
				.then(data => {
					dispatch({ type: MAGENTO_CART_ITEM_PRODUCT, payload: data });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const addGuestCartBillingAddress = (cartId, address) => {
	return dispatch => {
		magento.addGuestCartBillingAddress(cartId, address)
				.then(data => {
					dispatch({ type: MAGENTO_ADD_CART_BILLING_ADDRESS, payload: data });
					// dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 2 });
				})
				.catch(error => {
					console.log(error);
				});
		magento.guestCartEstimateShippingMethods(cartId, address)
				.then(data => {
					// console.log('guestCartEstimateShippingMethods');
					// console.log(data);
					dispatch({ type: MAGENTO_GET_CART_SHIPPING_METHODS, payload: data });
					dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 2 });
					dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const getGuestCartShippingMethods = cartId => {
	return dispatch => {
		magento.getGuestCartShippingMethods(cartId)
				.then(data => {
					dispatch({ type: MAGENTO_GET_CART_SHIPPING_METHODS, payload: data });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const addGuestCartShippingInfo = (cartId, address) => {
	return dispatch => {
		magento.addGuestCartShippingInfo(cartId, address)
				.then(data => {
					dispatch({ type: MAGENTO_ADD_SHIPPING_TO_CART, payload: data });
					dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
					dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 3 });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const getGuestCartPaymentMethods = cartId => {
	return dispatch => {
		magento.getGuestCartPaymentMethods(cartId)
				.then(data => {
					dispatch({ type: MAGENTO_GET_CART_PAYMENT_METHODS, payload: data });
					dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
					dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 4 });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const getCountries = () => {
	return dispatch => {
		magento.getCountries()
				.then(data => {
					dispatch({ type: MAGENTO_GET_COUNTRIES, payload: data });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const placeGuestCartOrder = (cartId, payment) => {
	return dispatch => {
		magento.placeGuestCartOrder(cartId, payment)
				.then(data => {
					dispatch({ type: MAGENTO_PLACE_GUEST_CART_ORDER, payload: data });
					dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
				})
				.catch(error => {
					console.log(error);
				});
	};
};

export const checkoutCreateCustomer = customer => {
	return dispatch => {
		magento.createCustomer(customer)
				.then(data => {
					dispatch({ type: MAGENTO_CREATE_CUSTOMER, payload: data });
				})
				.catch(error => {
					console.log(error);
				});
	};
};
