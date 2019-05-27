import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  DrawerActions,
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import Category from '../components/catalog/Category';
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
import SearchScreen from '../components/search/SearchScreen';
import OrdersScreen from '../components/account/OrdersScreen';
import OrderScreen from '../components/account/OrderScreen';
import AddressScreen from '../components/account/AddressScreen';
import DrawerScreen from '../components/catalog/DrawerScreen';


import CartBadge from '../components/cart/CartBadge';

import {
  NAVIGATION_CATEGORY_TREE_PATH,
  NAVIGATION_CATEGORY_PATH,
  NAVIGATION_CHECKOUT_PATH,
  NAVIGATION_HOME_PRODUCT_PATH,
  NAVIGATION_CART_PATH,
  NAVIGATION_HOME_STACK_PATH,
  NAVIGATION_HOME_SCREEN_PATH,
  NAVIGATION_LOGIN_PATH,
  NAVIGATION_SIGNIN_PATH,
  NAVIGATION_ACCOUNT_PATH,
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH,
  NAVIGATION_AUTH_LOADING_SWITCH,
  NAVIGATION_RESET_PASSWORD_PATH,
  NAVIGATION_AUTH_STACK_PATH,
  NAVIGATION_SEARCH_SCREEN_PATH,
  NAVIGATION_SEARCH_PRODUCT_PATH,
  NAVIGATION_ORDERS_PATH,
  NAVIGATION_ORDER_PATH,
  NAVIGATION_ADDRESS_SCREEN_PATH,
  NAVIGATION_DRAWER_SCREEN,
  BOTTOM_TAB_NAVIGATOR,
  NAVIGATION_FILTER_DRAWER_SCREEN
} from './routes';

const HomeStack = createStackNavigator(
  {
    [NAVIGATION_HOME_SCREEN_PATH]: HomeScreen,
    [NAVIGATION_CATEGORY_PATH]: Category,
    [NAVIGATION_HOME_PRODUCT_PATH]: Product,
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
  [NAVIGATION_RESET_PASSWORD_PATH]: PasswordReset,
});

const AccountStack = createStackNavigator({
  [NAVIGATION_ACCOUNT_PATH]: Account,
  [NAVIGATION_ORDERS_PATH]: OrdersScreen,
  [NAVIGATION_ORDER_PATH]: OrderScreen,
  [NAVIGATION_ADDRESS_SCREEN_PATH]: AddressScreen,
});

const AccountSwitch = createSwitchNavigator({
  [NAVIGATION_AUTH_LOADING_SWITCH]: AuthLoading,
  [NAVIGATION_LOGIN_STACK_PATH]: AuthStack,
  [NAVIGATION_ACCOUNT_STACK_PATH]: AccountStack
});

const SearchStack = createStackNavigator({
  [NAVIGATION_SEARCH_SCREEN_PATH]: SearchScreen,
  [NAVIGATION_SEARCH_PRODUCT_PATH]: Product,
});

const CartStack = createStackNavigator({
  [NAVIGATION_CART_PATH]: Cart,
  [NAVIGATION_CHECKOUT_PATH]: Checkout,
});

const MainAppNavigator = createBottomTabNavigator(
  {
    [NAVIGATION_HOME_STACK_PATH]: {
      screen: HomeStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => {
          return <Icon name="md-home" type="ionicon" color={tintColor} />;
        }
      })
    },
    [NAVIGATION_SEARCH_SCREEN_PATH]: {
      screen: SearchStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => {
          return <Icon name="md-search" type="ionicon" color={tintColor} />;
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
    },
    [NAVIGATION_CART_PATH]: {
      screen: CartStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => {
          return <CartBadge color={tintColor} />;
        }
      })
    },
  },
  {
    // initialRouteName: NAVIGATION_AUTH_STACK_PATH,
    tabBarOptions: {
      showLabel: false
    }
  }
);

const Drawer = createDrawerNavigator({
  [BOTTOM_TAB_NAVIGATOR]: {
    screen: MainAppNavigator
  },
  [NAVIGATION_DRAWER_SCREEN]: {
    screen: DrawerScreen,
    navigationOptions: { header: null }
  },
}, {
  contentComponent: CategoryTree,
});

export const Navigator = createDrawerNavigator(
  {
    Drawer,
  },
  {
    contentComponent: DrawerScreen,
    getCustomActionCreators: (route, stateKey) => {
      return {
        toggleFilterDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
      };
    },
  }
);
