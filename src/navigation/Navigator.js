import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import ProductList from '../components/catalog/ProductList';
import CategoryTree from '../components/catalog/CategoryTree';
import Product from '../components/catalog/Product';
import Cart from '../components/cart/Cart';
import Checkout from '../components/checkout/Checkout';
import Login from '../components/account/Login';
import Signin from '../components/account/Signin';
import Account from '../components/account/Account';
import AuthLoading from '../components/account/AuthLoading';
import PasswordReset from '../components/account/PasswordReset';
import HomeScreen from '../components/home/HomeScreen';

import {
  NAVIGATION_CATEGORY_TREE_PATH,
  NAVIGATION_CATEGORY_PATH,
  NAVIGATION_CHECKOUT_PATH,
  NAVIGATION_PRODUCT_PATH,
  NAVIGATION_CART_PATH,
  NAVIGATION_HOME_STACK_PATH,
  NAVIGATION_LOGIN_PATH,
  NAVIGATION_SIGNIN_PATH,
  NAVIGATION_ACCOUNT_PATH,
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH,
  NAVIGATION_AUTH_LOADING_SWITCH,
  NAVIGATION_RESET_PASSWORD_PATH,
  NAVIGATION_AUTH_STACK_PATH,
  NAVIGATION_HOME_SCREEN_PATH
} from './routes';

const HomeStack = createStackNavigator(
  {
    [NAVIGATION_HOME_SCREEN_PATH]: HomeScreen,
    [NAVIGATION_CATEGORY_TREE_PATH]: CategoryTree,
    [NAVIGATION_CATEGORY_PATH]: ProductList,
    [NAVIGATION_PRODUCT_PATH]: Product,
    [NAVIGATION_CART_PATH]: Cart,
    [NAVIGATION_CHECKOUT_PATH]: Checkout
  },
  {
    initialRouteName: NAVIGATION_HOME_SCREEN_PATH,
    navigationOptions: {
      headerStyle: {
        // backgroundColor: '#f4511e',
      },
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '500',
        fontSize: 18,
        alignSelf: 'center'
      }
    }
  }
);

const AuthStack = createStackNavigator({
  [NAVIGATION_LOGIN_PATH]: Login,
  [NAVIGATION_SIGNIN_PATH]: Signin,
  [NAVIGATION_RESET_PASSWORD_PATH]: PasswordReset
});

const AccountStack = createStackNavigator({
  [NAVIGATION_ACCOUNT_PATH]: Account
});

const AccountSwitch = createSwitchNavigator({
  [NAVIGATION_AUTH_LOADING_SWITCH]: AuthLoading,
  [NAVIGATION_LOGIN_STACK_PATH]: AuthStack,
  [NAVIGATION_ACCOUNT_STACK_PATH]: AccountStack
});

export const Navigator = createBottomTabNavigator(
  {
    [NAVIGATION_HOME_STACK_PATH]: {
      screen: HomeStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => {
          return <Icon name="md-home" type="ionicon" color={tintColor} />;
        }
      })
    },
    [NAVIGATION_AUTH_STACK_PATH]: {
      screen: AccountSwitch,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => {
          return <Icon name="md-person" type="ionicon" color={tintColor} />;
        }
      })
    }
  },
  {
    // initialRouteName: NAVIGATION_AUTH_STACK_PATH,
    tabBarOptions: {
      showLabel: false
    }
  }
);
