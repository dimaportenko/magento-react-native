import axios from 'axios'; // TODO: remove from dependencies

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
    this.auth_token = false;
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

  post(path, params, data) {
    return this.send(path, 'POST', params, data);
  }

  get(path, params, data) {
    return this.send(path, 'GET', params, data);
  }

  send(url, method, params, data) {
    const uri = `${this.base_url}${this.root_path}${url}`;

    //check if there's any missing parameters
    const missingFields = uri.match(/(\{[a-zA-Z0-9_]+\})/g);
    if (missingFields && missingFields.length > 0) {
      return Promise.reject(`URL missing parameters: ${missingFields.join(', ')}`);
    }

    const headers = {
      'User-Agent': this.configuration.userAgent,
      'Content-Type': 'application/json'
    };
    if (this.auth_token) {
      headers.Authorization = `Bearer ${this.auth_token}`;
    }

    return new Promise((resolve, reject) => {
      console.log({ method, headers, ...params });
      fetch(uri, { method, headers, body: JSON.stringify(params) })
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

  getProducts(pageSize = 5, currentPage = 0) {
    // return new Promise((resolve, reject) => {
    //   const path = '/V1/products';
    //   const params = {
    //     'searchCriteria[pageSize]': pageSize,
    //     'searchCriteria[currentPage]': currentPage
    //   };
    //   this.get(path, params)
    //     .then(data => {
    //       debugger;
    //       resolve(data);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       reject(e);
    //     });
    // });

    axios.get(`${this.base_url}index.php/rest/V1/products?searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.access_token}`
          }
        }
      )
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
  }


}

export default Magento;
