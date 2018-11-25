import { AsyncStorage } from 'react-native';
import { magento } from '../magento';
import { initMagento, getCart, setCurrentCustomer } from '../actions';


export const onAppStart = async (store) => {
  store.dispatch(initMagento());

  const customerToken = await AsyncStorage.getItem('customerToken');
  magento.setCustomerToken(customerToken);

  if (customerToken) {
    try {
      const customer = await magento.customer.getCurrentCustomer();
      store.dispatch(setCurrentCustomer(customer));
    } catch (error) {
      console.log('onAppStart -> unable to retrieve current customer', error);
    }
  }
  store.dispatch(getCart());
};
