import admin from './lib/admin';
import guest from './lib/guest';
import { ADMIN_TYPE, CUSTOMER_TYPE, GUEST_TYPE } from './types';

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
		this.admin = admin(this);
		this.guest = guest(this);
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

  post(path, params, type = ADMIN_TYPE) {
    return this.send(path, 'POST', null, params, type);
  }

  put(path, params, type = ADMIN_TYPE) {
    return this.send(path, 'PUT', null, params, type);
  }

  get(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, 'GET', params, data, type);
  }

  send(url, method, params, data, type) {
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
    if (this.access_token && type === ADMIN_TYPE) {
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

  setStoreConfig(config) {
    this.storeConfig = config;
	}

  getProductMediaUrl() {
    return `${this.storeConfig.base_media_url}catalog/product`;
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
