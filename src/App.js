import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { ThemeProvider, theme } from './theme';
import { Navigator } from './navigation/Navigator';
import NavigationService from './navigation/NavigationService';
import { onAppStart } from './helper/app';

import { Spinner } from './components/common';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-navigation';

onAppStart(store);

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: 'never' }}>
          <PersistGate loading={<Spinner />} persistor={persistor}>
            <Navigator
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </PersistGate>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  </Provider>
);

export default App;
