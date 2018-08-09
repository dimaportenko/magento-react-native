import { AsyncStorage } from 'react-native';
import { magento } from '../magento';
import { initMagento, createCustomerCart, getCart, setCurrentCustomer } from '../actions';


export const onAppStart = async (store) => {
  store.dispatch(initMagento());

  const customerToken = await AsyncStorage.getItem('customerToken');
  magento.setCustomerToken(customerToken);

  if (customerToken) {
    const customer = await magento.customer.getCurrentCustomer();
    store.dispatch(setCurrentCustomer(customer));
    store.dispatch(createCustomerCart(customer.id));
    store.dispatch(getCart());
  }
};
