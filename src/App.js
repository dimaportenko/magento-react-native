import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { Navigator } from './navigation/Navigator';
import NavigationService from './navigation/NavigationService';
import { onAppStart } from './helper/app';

import { Spinner } from './components/common';

onAppStart(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <Navigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}


export default App;
