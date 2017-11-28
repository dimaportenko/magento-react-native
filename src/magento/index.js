const defaultOptions = {
  url: null,
  store: 'default',
  userAgent: 'Interactiavated Magento Library',
  authentication: {
    login: {
      type: 'admin',
      username: undefined,
      password: undefined
    },
    integration: {
      consumer_key: undefined,
      consumer_secret: undefined,
      access_token: undefined,
      access_token_secret: undefined
    }
  }
};

class Magento {
	setOptions(options) {
		this.configuration = { ...defaultOptions, ...options };
		this.base_url = this.configuration.url;
		this.root_path = `rest/${this.configuration.store}`;
	}

  init() {
    return new Promise((resolve, reject) => {
      if (this.configuration.authentication.integration.access_token) {
        this.access_token = this.configuration.authentication.integration.access_token;
        resolve(this);
      } else if (this.configuration.authentication.login) {
        const { username, password, type } = this.configuration.authentication.login;
        if (username) {
          let path;
          if (type === 'admin') {
            path = '/V1/integration/admin/token';
          } else {
            path = '/V1/integration/customer/token';
          }

          this.post(path, { username, password })
            .then(token => {
              // debugger;
              console.log('token');
              this.access_token = token;
              resolve(this);
            })
            .catch(e => {
              console.log(e);
              reject(e);
            });
        }
      }
    });
  }

  post(path, params) {
    return this.send(path, 'POST', null, params);
  }

  put(path, params) {
    return this.send(path, 'PUT', null, params);
  }

  get(path, params, data) {
    return this.send(path, 'GET', params, data);
  }

  send(url, method, params, data) {
    let uri = `${this.base_url}${this.root_path}${url}`;

    if (params) {
      let separator = '?';
      Object.keys(params).forEach(key => {
        uri += `${separator}${key}=${params[key]}`;
        separator = '&';
      });
    }

    //check if there's any missing parameters
    const missingFields = uri.match(/(\{[a-zA-Z0-9_]+\})/g);
    if (missingFields && missingFields.length > 0) {
      return Promise.reject(`URL missing parameters: ${missingFields.join(', ')}`);
    }

    const headers = {
      'User-Agent': this.configuration.userAgent,
      'Content-Type': 'application/json'
    };
    if (this.access_token) {
      headers.Authorization = `Bearer ${this.access_token}`;
    }

    return new Promise((resolve, reject) => {
      console.log({ uri, method, headers, data, ...params });
      fetch(uri, { method, headers, body: JSON.stringify(data) })
        .then(response => {
					console.log(response);
					return response.json();
				})
        .then(responseData => {
					// TODO: check response code
					// debugger;
          console.log(responseData);
          resolve(responseData);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  getCategoriesTree() {
    return new Promise((resolve, reject) => {
      const path = '/V1/categories';
      this.get(path)
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }

  getProducts(categoryId, pageSize = 5, offset = 0) {
    const currentPage = parseInt(offset / pageSize, 10) + 1;
    return new Promise((resolve, reject) => {
      const path = '/V1/products';
      const params = {
        'searchCriteria[filterGroups][0][filters][0][field]': 'category_id',
        'searchCriteria[filterGroups][0][filters][0][value]': categoryId,
        'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
				'searchCriteria[filterGroups][0][filters][1][field]': 'visibility',
				'searchCriteria[filterGroups][0][filters][1][value]': '4',
				'searchCriteria[filterGroups][0][filters][1][conditionType]': 'eq',
        'searchCriteria[pageSize]': pageSize,
        'searchCriteria[currentPage]': currentPage
      };

			this.get(path, params)
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }

  getProductBySku(sku) {
		return new Promise((resolve, reject) => {
			const path = `/V1/products/${sku}`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

  getConfigurableChildren(sku) {
		return new Promise((resolve, reject) => {
			const path = `/V1/configurable-products/${sku}/children`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getConfigurableProductOptions(sku) {
		return new Promise((resolve, reject) => {
			const path = `/V1/configurable-products/${sku}/options/all`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getConfigurableProductOptionById(sku, id) {
		return new Promise((resolve, reject) => {
			const path = `/V1/configurable-products/${sku}/options/${id}`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getProductAttributesOptions(attributeId) {
		return new Promise((resolve, reject) => {
			const path = `/V1/products/attributes/${attributeId}/options`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getAttributeByCode(attributeCode) {
		return new Promise((resolve, reject) => {
			const path = `/V1/products/attributes/${attributeCode}`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getProductMedia(sku) {
		return new Promise((resolve, reject) => {
			const path = `/V1/products/${sku}/media`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
  }

  getProductMediaUrl() {
    return `${this.storeConfig.base_media_url}catalog/product`;
  }

  getStoreConfig() {
		return new Promise((resolve, reject) => {
			const path = '/V1/store/storeConfigs';

			this.get(path)
					.then(data => {
						resolve(data);
						this.storeConfig = data[0];
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
  }

  createGuestCart() {
		return new Promise((resolve, reject) => {
			const path = '/V1/guest-carts';

			this.post(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	addItemToCart(cartId, item) {
		// POST /V1/guest-carts/{cartId}/items
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/items`;

			this.post(path, item)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getGuestCart(cartId) {
		// GET /V1/guest-carts/{cartId}
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	addGuestCartBillingAddress(cartId, address) {
		// POST /V1/guest-carts/{cartId}/billing-address
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/billing-address`;

			this.post(path, address)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	guestCartEstimateShippingMethods(cartId, address) {
		// POST /V1/guest-carts/:cartId/estimate-shipping-methods"
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/estimate-shipping-methods`;

			this.post(path, address)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	addGuestCartShippingInfo(cartId, address) {
		// POST /V1/guest-carts/{cartId}/shipping-information
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/shipping-information`;

			this.post(path, address)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getGuestCartPaymentInfo(cartId) {
		// GET /V1/guest-carts/{cartId}/payment-information
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/payment-information`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getGuestCartPaymentMethods(cartId) {
		// GET /V1/guest-carts/{cartId}/payment-methods
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/payment-methods`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getGuestCartShippingMethods(cartId) {
		// GET /V1/guest-carts/{cartId}/shipping-methods
		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/shipping-methods`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	placeGuestCartOrder(cartId, payment) {
		// PUT /V1/guest-carts/{cartId}/order

		return new Promise((resolve, reject) => {
			const path = `/V1/guest-carts/${cartId}/order`;

			this.put(path, payment)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getCountries() {
		// GET /V1/directory/countries
		return new Promise((resolve, reject) => {
			const path = '/V1/directory/countries';

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	getCountriesByCountryId(countryId) {
		// GET /V1/directory/countries/:countryId
		return new Promise((resolve, reject) => {
			const path = `/V1/directory/countries/${countryId}`;

			this.get(path)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}

	createCustomer(customer) {
		// POST /V1/customers
		return new Promise((resolve, reject) => {
			const path = '/V1/customers';

			this.post(path, customer)
					.then(data => {
						resolve(data);
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
		});
	}
}

export const magento = new Magento();
