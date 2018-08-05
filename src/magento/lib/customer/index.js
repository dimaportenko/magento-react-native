import { CUSTOMER_TYPE } from '../../types';

export default magento => {
  return {
    getCurrentCustomer: () => {
      // GET /rest/V1/customers/me
      return new Promise((resolve, reject) => {
        const path = '/V1/customers/me';

        magento
          .get(path, undefined, undefined, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCustomerCart: () => {
      // GET /V1/carts/mine
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine';

        magento
          .get(path, undefined, undefined, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    createCart: customerId => {
      return new Promise((resolve, reject) => {
        const path = `/V1/customers/${customerId}/carts`;

        magento
          .post(path, undefined, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addItemToCart: item => {
      // POST /V1/carts/mine/items
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/items';

        magento
          .post(path, item, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addCartBillingAddress: (address) => {
      // POST /V1/carts/mine/billing-address
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/billing-address';

        magento
          .post(path, address, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    cartEstimateShippingMethods: (address) => {
      // POST /V1/carts/mine/estimate-shipping-methods"
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/estimate-shipping-methods';

        magento
          .post(path, address, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addCartShippingInfo: (address) => {
      // POST /V1/carts/mine/shipping-information
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/shipping-information';

        magento
          .post(path, address, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCartShippingMethods: () => {
      // GET /V1/carts/mine/estimate-shipping-methods
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/estimate-shipping-methods';

        magento
          .get(path, undefined, undefined, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCartPaymentMethods: () => {
      // GET /V1/carts/mine/payment-methods
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/payment-methods';

        magento
          .get(path, undefined, undefined, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    placeCartOrder: (payment) => {
      // PUT /V1/carts/mine/order
      return new Promise((resolve, reject) => {
        const path = '/V1/carts/mine/order';

        magento
          .put(path, payment, CUSTOMER_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },
  };
};
