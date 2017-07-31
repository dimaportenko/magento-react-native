import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import Magento from './magento';


class App extends Component {
  componentWillMount() {
    const options = {
      url: 'https://www.vapecove.com/',
      authentication: {
        login: {
          type: 'admin',
          username: 'dev',
          password: 'q1w2e3r4'
        },
        integration: {
          access_token: 'cdlodltsj3wfwd1jrx08q9nfprb5idq4'
        }
      }
    };

    const magento = new Magento(options);
    magento.init()
      .then(() => {
        magento.getProducts();
          // .then(data => {
          //   console.log('App.js');
          //   console.log(data);
          // });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <View />
      // <Provider store={createStore(reducers)} />
    );
  }

}

export default App;
