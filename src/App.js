import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Magento from './magento';


class App extends Component {
  componentWillMount() {
    const magento = new Magento(options);
    magento.init()
      .then(() => {
        magento.getCategoriesTree()
          .then(data => {
            console.log('App.js');
            console.log(data);
          })
          .catch(error => {
            // TODO :: handle error
            console.log(error);
          });
      })
      .catch(error => {
        // TODO :: handle error
        console.log(error);
      });
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <View />
      </Provider>
    );
  }
}

const options = {
  url: 'http://mage2.local/',
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

export default App;
