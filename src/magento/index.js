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
  constructor(options) {
    this.configuration = { ...defaultOptions, ...options };
    this.base_url = this.configuration.url;
    this.root_path = `rest/${this.configuration.store}`;
  }

  init() {
    return new Promise((resolve, reject) => {
      if (this.configuration.authentication.login) {
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
      } else if (this.configuration.authentication.integration.access_token) {
        this.access_token = this.configuration.authentication.integration.access_token;
        resolve(this);
      }
    });
  }

  post(path, params) {
    return this.send(path, 'POST', null, params);
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
      console.log({ uri, method, headers, ...params });
      fetch(uri, { method, headers, body: JSON.stringify(data) })
        .then(response => response.json())
        .then(responseData => {
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

  getProducts(pageSize = 5, currentPage = 0) {
    return new Promise((resolve, reject) => {
      const path = '/V1/products';
      const params = {
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


}

export default Magento;
