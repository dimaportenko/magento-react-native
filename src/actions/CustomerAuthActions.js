import { AsyncStorage } from 'react-native';
import { magento } from '../magento';
import {
  MAGENTO_PASSWORD_RESET_LOADING,
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_SUCCESS_MESSAGE,
  MAGENTO_CREATE_CUSTOMER,
  MAGENTO_AUTH_LOADING,
  MAGENTO_AUTH,
  MAGENTO_LOGOUT,
  MAGENTO_AUTH_ERROR
} from './types';
import NavigationService from '../navigation/NavigationService';
import {
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH,
  NAVIGATION_LOGIN_PATH
} from '../navigation/routes';

export const signIn = customer => {
  return async dispatch => {
    try {
      const response = await magento.guest.createCustomer(customer);
      dispatch({ type: MAGENTO_CREATE_CUSTOMER, payload: response });
      if (response.id && response.group_id) {
        const token = await magento.guest.auth(
          customer.customer.email,
          customer.password
        );
        if (token.message) {
          authFail(dispatch, token.message);
        } else {
          authSuccess(dispatch, token);
        }
      } else if (response.message) {
        authFail(dispatch, response.message);
      } else {
        authFail(dispatch, 'Something went wrong. Pleas try again later.');
      }
    } catch (e) {
      authFail(dispatch, e.message);
    }
  };
};

export const auth = (username, password) => {
  return async dispatch => {
    try {
      dispatch({ type: MAGENTO_AUTH_LOADING, payload: true });
      const response = await magento.guest.auth(username, password);
      if (response.message) {
        authFail(dispatch, response.message);
      } else {
        authSuccess(dispatch, response);
      }
    } catch (e) {
      authFail(dispatch, e.message);
    }
  };
};

const authSuccess = async (dispatch, token) => {
  dispatch({ type: MAGENTO_AUTH, payload: token });

  try {
    await AsyncStorage.setItem('customerToken', token);
    dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
    NavigationService.navigate(NAVIGATION_ACCOUNT_STACK_PATH);
  } catch (e) {
    authFail(dispatch, 'Something went wrong. Pleas try again later.');
  }
};

const authFail = (dispatch, message) => {
  dispatch(errorMessage(message));
  dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
};

export const errorMessage = error => {
  return { type: MAGENTO_AUTH_ERROR, payload: error };
};

export const logout = () => {
  return dispatch => {
    dispatch({ type: MAGENTO_AUTH, payload: '' });
    dispatch({ type: MAGENTO_LOGOUT });
    NavigationService.navigate(NAVIGATION_LOGIN_STACK_PATH);
    AsyncStorage.setItem('customerToken', '');
  };
};

export const initiatePasswordReset = email => {
  return async dispatch => {
    try {
      dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: true });
      await magento.guest.initiatePasswordReset(email);
      const message = `If there is an account associated with ${email} you will 
        receive an email with a link to reset your password.`;
      dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: false });
      dispatch({ type: MAGENTO_SUCCESS_MESSAGE, payload: message });
      NavigationService.navigate(NAVIGATION_LOGIN_PATH);
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const currentCustomer = () => {
  return async dispatch => {
    try {
      const customer = await magento.customer.getCurrentCustomer();
      dispatch({
        type: MAGENTO_CURRENT_CUSTOMER,
        payload: customer
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setCurrentCustomer = customer => {
 return {
   type: MAGENTO_CURRENT_CUSTOMER,
   payload: customer
 };
};
