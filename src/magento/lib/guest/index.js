import { GUEST_TYPE } from '../../types';

export default magento => {
  return {
    createGuestCart: () => {
      return new Promise((resolve, reject) => {
        const path = '/V1/guest-carts';

        magento
          .post(path, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addItemToCart: (cartId, item) => {
      // POST /V1/guest-carts/{cartId}/items
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/items`;

        magento
          .post(path, item, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getGuestCart: cartId => {
      // GET /V1/guest-carts/{cartId}
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}`;

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addGuestCartBillingAddress: (cartId, address) => {
      // POST /V1/guest-carts/{cartId}/billing-address
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/billing-address`;

        magento
          .post(path, address, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    guestCartEstimateShippingMethods: (cartId, address) => {
      // POST /V1/guest-carts/:cartId/estimate-shipping-methods"
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/estimate-shipping-methods`;

        magento
          .post(path, address, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    addGuestCartShippingInfo: (cartId, address) => {
      // POST /V1/guest-carts/{cartId}/shipping-information
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/shipping-information`;

        magento
          .post(path, address, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getGuestCartPaymentInfo: cartId => {
      // GET /V1/guest-carts/{cartId}/payment-information
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/payment-information`;

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getGuestCartPaymentMethods: cartId => {
      // GET /V1/guest-carts/{cartId}/payment-methods
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/payment-methods`;

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getGuestCartShippingMethods: cartId => {
      // GET /V1/guest-carts/{cartId}/shipping-methods
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/shipping-methods`;

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    placeGuestCartOrder: (cartId, payment) => {
      // PUT /V1/guest-carts/{cartId}/order
      return new Promise((resolve, reject) => {
        const path = `/V1/guest-carts/${cartId}/order`;

        magento
          .put(path, payment, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCountries: () => {
      // GET /V1/directory/countries
      return new Promise((resolve, reject) => {
        const path = '/V1/directory/countries';

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCountriesByCountryId: countryId => {
      // GET /V1/directory/countries/:countryId
      return new Promise((resolve, reject) => {
        const path = `/V1/directory/countries/${countryId}`;

        magento
          .get(path, undefined, undefined, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    createCustomer: customer => {
      // POST /V1/customers
      return new Promise((resolve, reject) => {
        const path = '/V1/customers';

        magento
          .post(path, customer, GUEST_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    auth: (username, password) => {
      return new Promise((resolve, reject) => {
        if (username) {
          const path = '/V1/integration/customer/token';

          magento
            .post(path, { username, password }, GUEST_TYPE)
            .then(token => {
              console.log('token');
              magento.setCustomerToken(token);

              resolve(token);
            })
            .catch(e => {
              console.log(e);
              reject(e);
            });
        } else {
          reject('Email is required!');
        }
      });
    },

    initiatePasswordReset: email => {
      // PUT /V1/customers/password
      const data = {
        email,
        template: 'email_reset',
        websiteId: magento.configuration.websiteId
      };

      return new Promise((resolve, reject) => {
        const path = '/V1/customers/password';

        magento
          .put(path, data, GUEST_TYPE)
          .then(response => {
            resolve(response);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    }
  };
};
