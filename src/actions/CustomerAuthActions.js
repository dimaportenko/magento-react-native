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
  MAGENTO_AUTH_ERROR,
  MAGENTO_LOGIN_SUCCESS,
} from './types';
import NavigationService from '../navigation/NavigationService';
import {
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH,
  NAVIGATION_LOGIN_PATH,
} from '../navigation/routes';
import { logError } from '../helper/logger';

export const signIn = customer => async (dispatch) => {
  try {
    const response = await magento.guest.createCustomer(customer);
    dispatch({ type: MAGENTO_CREATE_CUSTOMER, payload: response });
    if (response.id && response.group_id) {
      const token = await magento.guest.auth(
        customer.customer.email,
        customer.password,
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
    logError(e);
    authFail(dispatch, e.message);
  }
};

export const auth = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: MAGENTO_AUTH_LOADING, payload: true });
    const response = await magento.guest.auth(username, password);
    console.log('token');
    magento.setCustomerToken(response);
    if (response.message) {
      authFail(dispatch, response.message);
    } else {
      authSuccess(dispatch, response);
      dispatch({ type: MAGENTO_LOGIN_SUCCESS });
    }
  } catch (e) {
    logError(e);
    authFail(dispatch, e.message);
  }
};

const authSuccess = async (dispatch, token) => {
  dispatch({ type: MAGENTO_AUTH, payload: token });

  try {
    await AsyncStorage.setItem('customerToken', token);
    dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
    NavigationService.navigate(NAVIGATION_ACCOUNT_STACK_PATH);
  } catch (e) {
    logError(e);
    authFail(dispatch, 'Something went wrong. Pleas try again later.');
  }
};

const authFail = (dispatch, message) => {
  dispatch(errorMessage(message));
  dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
};

export const errorMessage = error => ({ type: MAGENTO_AUTH_ERROR, payload: error });

export const logout = () => (dispatch) => {
  dispatch({ type: MAGENTO_AUTH, payload: '' });
  dispatch({ type: MAGENTO_LOGOUT });
  NavigationService.navigate(NAVIGATION_LOGIN_STACK_PATH);
  AsyncStorage.setItem('customerToken', '');
};

export const initiatePasswordReset = email => async (dispatch) => {
  try {
    dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: true });
    await magento.guest.initiatePasswordReset(email);
    const message = `If there is an account associated with ${email} you will 
        receive an email with a link to reset your password.`;
    dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: false });
    dispatch({ type: MAGENTO_SUCCESS_MESSAGE, payload: message });
    NavigationService.navigate(NAVIGATION_LOGIN_PATH);
  } catch (e) {
    logError(e);
  }
};

export const currentCustomer = () => async (dispatch) => {
  try {
    const customer = await magento.customer.getCurrentCustomer();
    dispatch({
      type: MAGENTO_CURRENT_CUSTOMER,
      payload: customer,
    });
  } catch (error) {
    logError(error);
  }
};

export const setCurrentCustomer = customer => ({
  type: MAGENTO_CURRENT_CUSTOMER,
  payload: customer,
});
