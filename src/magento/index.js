import _ from 'lodash';
import admin from './lib/admin';
import guest from './lib/guest';
import customer from './lib/customer';
import { ADMIN_TYPE, CUSTOMER_TYPE } from './types';
import { logError } from '../helper/logger';
import { parseNumber } from './utils/parser';

const defaultOptions = {
  url: null,
  store: 'default',
  userAgent: 'Dmytro Portenko Magento Library',
  home_cms_block_id: '',
  authentication: {
    integration: {
      access_token: undefined,
    },
  },
};

class Magento {
  setOptions(options) {
    this.configuration = { ...defaultOptions, ...options };
    this.base_url = this.configuration.url;
    this.root_path = `rest/${this.configuration.store}`;
    this.admin = admin(this);
    this.guest = guest(this);
    this.customer = customer(this);
    this.getMagentoVersion();
    logError(new Error(JSON.stringify(options)));
  }

  init() {
    if (this.configuration.authentication.integration.access_token) {
      this.access_token =
        this.configuration.authentication.integration.access_token;
      return;
    }
    throw new Error('Need Integration Token!');
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

    // check if there's any missing parameters
    const missingFields = uri.match(/(\{[a-zA-Z0-9_]+\})/g);
    if (missingFields && missingFields.length > 0) {
      return Promise.reject(
        `URL missing parameters: ${missingFields.join(', ')}`,
      );
    }

    const headers = {
      'User-Agent': this.configuration.userAgent,
      'Content-Type': 'application/json',
    };
    if (this.access_token && type === ADMIN_TYPE) {
      headers.Authorization = `Bearer ${this.access_token}`;
    } else if (this.customerToken && type === CUSTOMER_TYPE) {
      headers.Authorization = `Bearer ${this.customerToken}`;
    }

    return new Promise((resolve, reject) => {
      console.log({
        uri,
        method,
        headers,
        data,
        ...params,
      });
      fetch(uri, { method, headers, body: JSON.stringify(data) })
        .then(response => {
          console.log(response);
          if (response.ok) {
            return response.json();
          }
          // Possible 401 or other network error
          return response.json().then(errorResponse => {
            logError(errorResponse);
            reject(errorResponse);
          });
        })
        .then(responseData => {
          // debugger;
          console.log(responseData);
          resolve(responseData);
        })
        .catch(error => {
          logError(error);
          const customError = this.getErrorMessageForResponce(error);
          reject(new Error(customError));
        });
    });
  }

  getErrorMessageForResponce(data) {
    const params = data.parameters;
    let { message } = data;
    if (typeof params !== 'undefined') {
      if (Array.isArray(params) && params.length > 0) {
        data.parameters.forEach((item, index) => {
          message = message.replace(`%${index + 1}`, item);
        });
        return message;
      }
      _.forEach(params, (value, name) => {
        message = message.replace(`%${name}`, value);
      });
    }
    return message;
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

  getMagentoVersion = async () => {
    try {
      const response = await fetch(`${this.base_url}magento_version`);
      const text = await response.text();
      const number = parseNumber(text);
      this.version = `${number}`;

      return number;
    } catch (error) {
      logError(error);
      return false;
    }
  };

  makeParams = ({ sort, page, pageSize, filter }) => {
    let index = 0;
    let query = '';
    if (typeof sort !== 'undefined') {
      query += `searchCriteria[sortOrders][${index}][field]=${sort}&`;
    }

    if (typeof page !== 'undefined') {
      query += `searchCriteria[currentPage]=${page}&`;
    }

    if (typeof pageSize !== 'undefined') {
      query += `searchCriteria[pageSize]=${pageSize}&`;
    }

    if (typeof filter !== 'undefined') {
      Object.keys(filter).forEach(key => {
        let value = filter[key];
        let condition = null;
        let subQuery = '';
        if (typeof value === 'object') {
          condition = value.condition;
          value = value.value;
          if (condition.includes('from')) {
            const conditions = condition.split(',');
            const values = value.split(',');
            index++;
            subQuery = `searchCriteria[filter_groups][${index}][filters][0][field]=${key}&`;
            subQuery += `searchCriteria[filter_groups][${index}][filters][0][value]=${values[0]}&`;
            subQuery += `searchCriteria[filter_groups][${index}][filters][0][condition_type]=${conditions[0]}&`;
            index++;
            subQuery += `searchCriteria[filter_groups][${index}][filters][0][field]=${key}&`;
            subQuery += `searchCriteria[filter_groups][${index}][filters][0][value]=${values[1]}&`;
            subQuery += `searchCriteria[filter_groups][${index}][filters][0][condition_type]=${conditions[1]}&`;
          }
        } else {
          condition = 'eq';
        }
        if (condition.includes('from')) {
          query += subQuery;
        } else {
          index++;
          query += `searchCriteria[filter_groups][${index}][filters][0][field]=${key}&`;
          query += `searchCriteria[filter_groups][${index}][filters][0][value]=${value}&`;
          query += `searchCriteria[filter_groups][${index}][filters][0][condition_type]=${condition}&`;
        }
      });
    }

    return query;
  };
}

export const magento = new Magento();
