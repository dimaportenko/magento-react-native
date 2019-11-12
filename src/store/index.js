import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import AsyncStorage from '@react-native-community/async-storage';


import reducers from '../reducers';

const categoryTreeSubsetBlacklistFilter = createBlacklistFilter(
  'categoryTree',
  ['refreshing'],
);

const customerAuthSubsetBlacklistFilter = createBlacklistFilter(
  'customerAuth',
  ['loading', 'reset_loading'],
);

const accountSubsetBlacklistFilter = createBlacklistFilter(
  'account',
  ['refreshing'],
);

const cartSubsetBlacklistFilter = createBlacklistFilter(
  'cart',
  ['addToCartLoading', 'errorMessage', 'refreshing'],
);

const homeSubsetBlacklistFilter = createBlacklistFilter(
  'home',
  ['refreshing'],
);

const searchSubsetBlacklistFilter = createBlacklistFilter(
  'search',
  ['loadingMore'],
);

const persistConfig = {
  key: 'root',
  transforms: [
    categoryTreeSubsetBlacklistFilter,
    customerAuthSubsetBlacklistFilter,
    accountSubsetBlacklistFilter,
    cartSubsetBlacklistFilter,
    homeSubsetBlacklistFilter,
    searchSubsetBlacklistFilter,
  ],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(thunk)),
);

export const persistor = persistStore(store);

// persistor.purge();
