import { createStore, applyMiddleware, compose, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import AsyncStorage from '@react-native-community/async-storage';

import reducers, { StoreStateType } from '../reducers';
import { magentoOptions } from '../config/magento';

const categoryTreeSubsetBlacklistFilter = createBlacklistFilter(
  'categoryTree',
  ['refreshing'],
);

const customerAuthSubsetBlacklistFilter = createBlacklistFilter(
  'customerAuth',
  ['loading', 'reset_loading'],
);

const accountSubsetBlacklistFilter = createBlacklistFilter('account', [
  'refreshing',
]);

const cartSubsetBlacklistFilter = createBlacklistFilter('cart', [
  'addToCartLoading',
  'errorMessage',
  'refreshing',
  'couponLoading',
]);

const homeSubsetBlacklistFilter = createBlacklistFilter('home', ['refreshing']);

const searchSubsetBlacklistFilter = createBlacklistFilter('search', [
  'loadingMore',
]);

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

const persistedReducer = persistReducer<StoreStateType>(
  persistConfig,
  reducers,
);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(thunk)),
);

export type StoreGetStateType = typeof store.getState;
export type StoreDispatchType = ThunkDispatch<StoreStateType, void, AnyAction>;

export const persistor = persistStore(store);

if (!magentoOptions.persistAppData) {
  persistor.purge();
}
