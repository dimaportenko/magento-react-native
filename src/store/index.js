import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/lib/storage';


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
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // TODO: remove for production
  applyMiddleware(thunk),
);

export const persistor = persistStore(store);

// persistor.purge();
