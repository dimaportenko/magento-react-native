import AsyncStorage from '@react-native-community/async-storage';
import { magento } from '../magento';
import { initMagento, getCart, setCurrentCustomer } from '../actions';
import { logError } from './logger';
import { store as rStore } from '../store/';

export const onAppStart = async (store: typeof rStore) => {
  store.dispatch(initMagento());

  const customerToken = await AsyncStorage.getItem('customerToken');
  magento.setCustomerToken(customerToken);

  if (customerToken) {
    try {
      const customer = await magento.customer.getCurrentCustomer();
      store.dispatch(setCurrentCustomer(customer));
    } catch (error) {
      console.log('onAppStart -> unable to retrieve current customer', error);
      logError(error);
    }
  }
  store.dispatch(getCart());
};
