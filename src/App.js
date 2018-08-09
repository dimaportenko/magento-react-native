import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Navigator } from './navigation/Navigator';
import NavigationService from './navigation/NavigationService';
import { onAppStart } from './helper/app';

onAppStart(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}


export default App;
