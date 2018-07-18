import { AsyncStorage } from 'react-native';
import { magento } from '../magento';
import {
  MAGENTO_AUTH_LOADING,
  MAGENTO_AUTH,
  MAGENTO_AUTH_ERROR
} from './types';
import NavigationService from '../navigation/NavigationService';
import { NAVIGATION_ACCOUNT_STACK_PATH } from '../navigation/routes';

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
