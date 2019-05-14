import { AsyncStorage } from 'react-native';
import _ from 'lodash';
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
  MAGENTO_RESET_CATEGORY_PRODUCTS,
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
  UI_CHECKOUT_CUSTOMER_NEXT_LOADING,
  HOME_SCREEN_DATA,
  MAGENTO_GET_FEATURED_PRODUCTS,
  MAGENTO_UPDATE_FEATURED_CONF_PRODUCT,
  MAGENTO_REMOVE_FROM_CART,
  MAGENTO_REMOVE_FROM_CART_LOADING,
  MAGENTO_GET_SEARCH_PRODUCTS,
  MAGENTO_UPDATE_SEARCH_CONF_PRODUCT,
  MAGENTO_LOAD_MORE_SEARCH_PRODUCTS,
  MAGENTO_RESET_SEARCH_PRODUCTS,
  MAGENTO_STORE_CONFIG,
  MAGENTO_GET_ORDERS,
  MAGENTO_ORDER_PRODUCT_DETAIL,
  MAGENTO_UPDATE_CATEGORY_PRODUCTS,
  MAGENTO_UPDATE_REFRESHING_CATEGORY_PRODUCTS,
  MAGENTO_UPDATE_REFRESHING_HOME_DATA,
  MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE,
  MAGENTO_UPDATE_REFRESHING_CART_ITEM_PRODUCT,
  MAGENTO_ERROR_MESSAGE_CART_ORDER,
  MAGENTO_GET_FILTERED_PRODUCTS,
} from './types';

export const initMagento = () => {
  magento.setOptions(magentoOptions);

  return async dispatch => {
    try {
      await magento.init();
      dispatch({ type: MAGENTO_INIT, payload: magento });
      const storeConfig = await magento.admin.getStoreConfig();
      dispatch({ type: MAGENTO_STORE_CONFIG, payload: storeConfig });
      const customerToken = await AsyncStorage.getItem('customerToken');
      magento.setCustomerToken(customerToken);
    } catch (error) {
      console.log(error);
    }
  };
};

export const getHomeData = (refreshing) => {
  return async dispatch => {
    if (refreshing) {
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_HOME_DATA, payload: true });
    }

    try {
      await magento.admin.getStoreConfig();
      const value = await magento.getHomeData();
      console.log('home', value);
      const payload = JSON.parse(value.content.replace(/<\/?[^>]+(>|$)/g, ''));
      dispatch({ type: HOME_SCREEN_DATA, payload });
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_HOME_DATA, payload: false });

      _.forEach(payload.featuredCategories, (details, categoryId) =>
        getFeaturedCategoryProducts(categoryId, dispatch)
      );
    } catch (e) {
      console.log(e);
    }
  };
};

const getFeaturedCategoryProducts = async (categoryId, dispatch) => {
  try {
    const products = await magento.admin.getProducts(categoryId);
    dispatch({
      type: MAGENTO_GET_FEATURED_PRODUCTS,
      payload: { categoryId, products },
    });
    updateConfigurableProductsPrices(
      products.items,
      dispatch,
      MAGENTO_UPDATE_FEATURED_CONF_PRODUCT
    );
  } catch (e) {
    console.log(e);
  }
};

export const getCategoryTree = (refreshing) => {
  return async dispatch => {
    if (refreshing) {
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE, payload: true });
    }

    try {
      const data = await magento.admin.getCategoriesTree();
      dispatch({ type: MAGENTO_GET_CATEGORY_TREE, payload: data });
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE, payload: false });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProductsForCategory = ({ id, offset }) => {
  return dispatch => {
    if (offset) {
      dispatch({ type: MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS, payload: true });
    }
    magento.admin
      .getProducts(id, 10, offset)
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

export const getProductsForCategoryOrChild = (category, offset, sortOrder) => {
  return async dispatch => {
    if (offset) {
      dispatch({ type: MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS, payload: true });
    }

    if (!offset && typeof sortOrder === 'number') {
      dispatch({ type: MAGENTO_RESET_CATEGORY_PRODUCTS });
    }

    try {
      const payload = await magento.admin
        .getSearchCreteriaForCategoryAndChild(category, 10, offset, sortOrder);
      dispatch({ type: MAGENTO_GET_CATEGORY_PRODUCTS, payload });
      dispatch({ type: MAGENTO_LOAD_MORE_CATEGORY_PRODUCTS, payload: false });
      updateConfigurableProductsPrices(payload.items, dispatch);
    } catch (e) {
      console.log(e);
    }
  };
};

export const updateProductsForCategoryOrChild = (category, refreshing) => {
  return async dispatch => {
    if (refreshing) {
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CATEGORY_PRODUCTS, payload: true });
    }

    try {
      const payload = await magento.admin
        .getSearchCreteriaForCategoryAndChild(category, 10);
      dispatch({ type: MAGENTO_UPDATE_CATEGORY_PRODUCTS, payload });
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CATEGORY_PRODUCTS, payload: false });
      updateConfigurableProductsPrices(payload.items, dispatch);
    } catch (e) {
      console.log(e);
    }
  };
};

export const getSearchProducts = (searchInput, offset, sortOrder) => {
  return async dispatch => {
    if (offset) {
      dispatch({ type: MAGENTO_LOAD_MORE_SEARCH_PRODUCTS, payload: true });
    }

    if (!offset && typeof sortOrder === 'number') {
      dispatch({ type: MAGENTO_RESET_SEARCH_PRODUCTS });
    }

    try {
      const data = await magento.admin
        .getProductsWithAttribute('name', searchInput, 10, offset, sortOrder);
      dispatch({ type: MAGENTO_GET_SEARCH_PRODUCTS, payload: { searchInput, data } });
      dispatch({ type: MAGENTO_LOAD_MORE_SEARCH_PRODUCTS, payload: false });
      updateConfigurableProductsPrices(
        data.items,
        dispatch,
        MAGENTO_UPDATE_SEARCH_CONF_PRODUCT
      );
    } catch (e) {
      console.log(e);
    }
  };
};

export const getConfigurableProductOptions = sku => {
  return dispatch => {
    magento.admin
      .getConfigurableProductOptions(sku)
      .then(data => {
        dispatch({ type: MAGENTO_GET_CONF_OPTIONS, payload: data });
        data.forEach(option => {
          magento.admin
            .getAttributeByCode(option.attribute_id)
            .then(attributeOptions => {
              dispatch({
                type: MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS,
                payload: {
                  attributeId: option.attribute_id,
                  options: attributeOptions.options,
                  attributeCode: attributeOptions.attribute_code,
                },
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

const updateConfigurableProductsPrices = (products, dispatch, type) => {
  products.forEach(product => {
    if (product.type_id === 'configurable') {
      updateConfigurableProductPrice(product, dispatch, type);
    }
  });
};

const updateConfigurableProductPrice = async (
  product,
  dispatch,
  type = MAGENTO_UPDATE_CONF_PRODUCT
) => {
  const { sku } = product;
  try {
    const data = await magento.admin.getConfigurableChildren(sku);
    dispatch({ type, payload: { sku, children: data } });
  } catch (e) {
    console.log(e);
  }
};

export const getProductMedia = ({ sku }) => {
  return dispatch => {
    magento.admin
      .getProductMedia(sku)
      .then(media => {
        dispatch({ type: MAGENTO_GET_PRODUCT_MEDIA, payload: { sku, media } });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const setCurrentCategory = category => {
  return {
    type: MAGENTO_CURRENT_CATEGORY,
    payload: category,
  };
};

export const setCurrentProduct = product => {
  return {
    type: MAGENTO_CURRENT_PRODUCT,
    payload: product,
  };
};

export const createCustomerCart = customerId => {
  return async dispatch => {
    if (customerId) {
      const cartId = await magento.admin.getCart(customerId);
      dispatch({ type: MAGENTO_CREATE_CART, payload: cartId });
    }
  };
};

export const getCart = (refreshing) => {
  return async dispatch => {
    if (refreshing) {
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CART_ITEM_PRODUCT, payload: true });
    }

    try {
      let cart;
      if (magento.isCustomerLogin()) {
        cart = await magento.customer.getCustomerCart();
      } else {
        const cartId = await magento.getCart();
        cart = await magento.guest.getGuestCart(cartId);
      }
      dispatch({ type: MAGENTO_GET_CART, payload: cart });
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_CART_ITEM_PRODUCT, payload: false });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addToCartLoading = isLoading => {
  return {
    type: MAGENTO_ADD_TO_CART_LOADING,
    payload: isLoading,
  };
};

export const addToCart = ({ cartId, item, customer }) => {
  return async dispatch => {
    try {
      if (cartId) {
        return dispatchAddToCart(dispatch, cartId, item);
      }

      const updatedItem = item;
      if (magento.isCustomerLogin()) {
        const customerCartId = await magento.admin.getCart(customer.id);
        dispatch({ type: MAGENTO_CREATE_CART, payload: customerCartId });
        updatedItem.cartItem.quoteId = customerCartId;
        return dispatchAddToCart(dispatch, customerCartId, updatedItem);
      }

      const guestCartId = await magento.guest.createGuestCart();
      dispatch({ type: MAGENTO_CREATE_CART, payload: guestCartId });
      updatedItem.cartItem.quoteId = guestCartId;
      return dispatchAddToCart(dispatch, guestCartId, updatedItem);
    } catch (error) {
      console.log(error);
    }
  };
};

const dispatchAddToCart = async (dispatch, cartId, item) => {
  try {
    let result;
    if (magento.isCustomerLogin()) {
      result = await magento.customer.addItemToCart(item);
    } else {
      result = await magento.guest.addItemToCart(cartId, item);
    }
    dispatch({ type: MAGENTO_ADD_TO_CART, payload: result });
    dispatchGetGuestCart(dispatch, cartId);
  } catch (e) {
    console.log(e);
  }
};

const dispatchGetGuestCart = async (dispatch, cartId) => {
  try {
    let data;
    if (magento.isCustomerLogin()) {
      data = await magento.customer.getCustomerCart();
    } else {
      data = await magento.guest.getGuestCart(cartId);
    }
    dispatch({ type: MAGENTO_GET_CART, payload: data });
  } catch (e) {
    console.log(e);
  }
};

export const cartItemProduct = (sku) => {
  return async dispatch => {
    try {
      const data = await magento.admin.getProductBySku(sku);
      dispatch({ type: MAGENTO_CART_ITEM_PRODUCT, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getOrdersForCustomer = (customerId, refreshing) => {
  return async dispatch => {
    if (refreshing) {
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_HOME_DATA, payload: true });
    }

    try {
      const data = await magento.admin.getOrderList(customerId);
      const orders = data.items.map(order => {
        const items = order.items;
        const simpleItems = items.filter(i => i.product_type === 'simple');
        const simpleItemsWithPriceAndName = simpleItems.map(simpleItem => {
          if (simpleItem.parent_item) {
            simpleItem.price = simpleItem.parent_item.price;
            simpleItem.row_total = simpleItem.parent_item.row_total;
            simpleItem.name = simpleItem.parent_item.name || simpleItem.name;
          }
          return simpleItem;
        });
        order.items = simpleItemsWithPriceAndName;
        return order;
      });
      data.items = orders;
      dispatch({ type: MAGENTO_GET_ORDERS, payload: data });
      dispatch({ type: MAGENTO_UPDATE_REFRESHING_HOME_DATA, payload: false });
    } catch (error) {
      console.log(error);
    }
  };
};

// Fetch product_data for product in OrderScreen
export const orderProductDetail = (sku) => {
  return async dispatch => {
    try {
      const product = await magento.admin.getProductBySku(sku);
      dispatch({
        type: MAGENTO_ORDER_PRODUCT_DETAIL,
        payload: {
          sku,
          product
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addGuestCartBillingAddress = (cartId, address) => {
  return async dispatch => {
    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.addCartBillingAddress(address);
      } else {
        data = await magento.guest.addGuestCartBillingAddress(cartId, address);
      }
      dispatch({ type: MAGENTO_ADD_CART_BILLING_ADDRESS, payload: data });
    } catch (error) {
      console.log(error);
    }

    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.cartEstimateShippingMethods(address);
      } else {
        data = await magento.guest.guestCartEstimateShippingMethods(
          cartId,
          address
        );
      }
      dispatch({ type: MAGENTO_GET_CART_SHIPPING_METHODS, payload: data });
      dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 2 });
      dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getGuestCartShippingMethods = cartId => {
  return async dispatch => {
    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.getCartShippingMethods();
      } else {
        data = await magento.guest.getGuestCartShippingMethods(cartId);
      }
      dispatch({ type: MAGENTO_GET_CART_SHIPPING_METHODS, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addGuestCartShippingInfo = (cartId, address) => {
  return async dispatch => {
    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.addCartShippingInfo(address);
      } else {
        data = await magento.guest.addGuestCartShippingInfo(cartId, address);
      }
      dispatch({ type: MAGENTO_ADD_SHIPPING_TO_CART, payload: data });
      dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
      dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 3 });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getGuestCartPaymentMethods = cartId => {
  return async dispatch => {
    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.getCartPaymentMethods();
      } else {
        data = await magento.guest.getGuestCartPaymentMethods(cartId);
      }
      dispatch({ type: MAGENTO_GET_CART_PAYMENT_METHODS, payload: data });
      dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
      dispatch({ type: UI_CHECKOUT_ACTIVE_SECTION, payload: 4 });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getCountries = () => {
  return dispatch => {
    magento.guest
      .getCountries()
      .then(data => {
        dispatch({ type: MAGENTO_GET_COUNTRIES, payload: data });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const placeGuestCartOrder = (cartId, payment) => {
  return async dispatch => {
    try {
      let data;
      if (magento.isCustomerLogin()) {
        data = await magento.customer.placeCartOrder(payment);
      } else {
        data = await magento.guest.placeGuestCartOrder(cartId, payment);
      }
      if (!data.message) {
        dispatch({ type: MAGENTO_PLACE_GUEST_CART_ORDER, payload: data });
      } else {
        const message = magento.getErrorMessageForResponce(data);
        dispatch({ type: MAGENTO_ERROR_MESSAGE_CART_ORDER, payload: message });
      }
      dispatch({ type: UI_CHECKOUT_CUSTOMER_NEXT_LOADING, payload: false });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createCustomer = customer => {
  return dispatch => {
    magento.guest
      .createCustomer(customer)
      .then(data => {
        dispatch({ type: MAGENTO_CREATE_CUSTOMER, payload: data });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const removeFromCartLoading = isLoading => {
  return {
    type: MAGENTO_REMOVE_FROM_CART_LOADING,
    payload: isLoading,
  };
};

export const getFilteredProducts = ({ page, pageSize, filter }) => {
  return async dispatch => {
    try {
      const data = await magento.admin.getFeaturedChildren({ page, pageSize, filter });
      dispatch({ type: MAGENTO_GET_FILTERED_PRODUCTS, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeFromCart = ({ cart, item }) => {
  return async dispatch => {
    try {
      console.log('removeFromCart', cart, item);
      if (cart.quote) {
        dispatchRemoveFromCart(dispatch, cart, item);
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: MAGENTO_REMOVE_FROM_CART, payload: error.message });
    }
  };
};

const dispatchRemoveFromCart = async (dispatch, cart, item) => {
  try {
    const result = await magento.admin.removeItemFromCart(cart.quote.id, item.item_id);
    dispatch({ type: MAGENTO_REMOVE_FROM_CART, payload: result });
    dispatchGetCart(dispatch, cart.cartId);
    dispatch({ type: MAGENTO_REMOVE_FROM_CART_LOADING, payload: false });
  } catch (e) {
    //TODO: handle error
    dispatch({ type: MAGENTO_REMOVE_FROM_CART, payload: e.message });
    dispatch({ type: MAGENTO_REMOVE_FROM_CART_LOADING, payload: false });
    console.log(e);
  }
};

const dispatchGetCart = async (dispatch, cartId) => {
  try {
    let data;
    if (magento.isCustomerLogin()) {
      data = await magento.customer.getCustomerCart();
    } else {
      data = await magento.guest.getGuestCart(cartId);
    }
    dispatch({ type: MAGENTO_GET_CART, payload: data });
  } catch (e) {
    console.log(e);
  }
};
