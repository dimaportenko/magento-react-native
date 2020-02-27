import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
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
  ['addToCartLoading', 'errorMessage', 'refreshing', 'couponLoading'],
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
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(thunk)),
);

export const persistor = persistStore(store);

// TODO: remove `persistor.purge()` to persist your application data
persistor.purge();
