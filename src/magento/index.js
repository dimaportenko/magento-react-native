import admin from './lib/admin';
import guest from './lib/guest';
import customer from './lib/customer';
import { ADMIN_TYPE, CUSTOMER_TYPE } from './types';

const defaultOptions = {
  url: null,
  store: 'default',
  userAgent: 'Dmytro Portenko Magento Library',
  home_cms_block_id: '',
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
    this.customer = customer(this);
  }

  init() {
    return new Promise((resolve, reject) => {
      if (this.configuration.authentication.integration.access_token) {
        this.access_token = this.configuration.authentication.integration.access_token;
        resolve(this);
      } else if (this.configuration.authentication.login) {
        const {
          username,
          password,
          type
        } = this.configuration.authentication.login;
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

  delete(path, params, type = ADMIN_TYPE) {
    return this.send(path, 'DELETE', params, null, type);
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
      return Promise.reject(
        `URL missing parameters: ${missingFields.join(', ')}`
      );
    }

    const headers = {
      'User-Agent': this.configuration.userAgent,
      'Content-Type': 'application/json'
    };
    if (this.access_token && type === ADMIN_TYPE) {
      headers.Authorization = `Bearer ${this.access_token}`;
    } else if (this.customerToken && type === CUSTOMER_TYPE) {
      headers.Authorization = `Bearer ${this.customerToken}`;
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

  setCustomerToken(token) {
    this.customerToken = token;
  }

  isCustomerLogin() {
    if (this.customerToken) {
      return true;
    }
    return false;
  }

  setAccessToken(token) {
    this.access_token = token;
  }

  getMediaUrl() {
    return this.storeConfig.base_media_url;
  }

  getProductMediaUrl() {
    return `${this.storeConfig.base_media_url}catalog/product`;
  }

  getCart() {
    if (this.isCustomerLogin()) {
      return this.customer.getCustomerCart();
    }
    return this.guest.createGuestCart();
  }

  getHomeData() {
    if (this.configuration.home_cms_block_id) {
      return this.admin.getCmsBlock(this.configuration.home_cms_block_id);
    }
    return false;
  }
}

export const magento = new Magento();
