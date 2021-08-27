import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { DrawerActions } from 'react-navigation-drawer';

import { Icon } from 'react-native-elements';

import Category from '../components/catalog/Category';
import CategoryTree from '../components/catalog/CategoryTree';
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

import * as routes from './routes';

import { theme } from '../theme';
import { ProductScreen } from '../components/catalog/ProductScreen';
import { NAVIGATION_CHECKOUT_STACK_PATH } from './routes';

const defaultHeader = {
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerTitleStyle: {
    ...theme.typography.titleTextSemiBold,
    alignSelf: 'center',
  },
  headerBackTitle: null,
  headerTintColor: theme.colors.appbarTint,
  headerBackTitleVisible: false,
};

const HomeStack = createStackNavigator(
  {
    [routes.NAVIGATION_HOME_SCREEN_PATH]: HomeScreen,
    [routes.NAVIGATION_CATEGORY_PATH]: Category,
    [routes.NAVIGATION_HOME_PRODUCT_PATH]: ProductScreen,
  },
  {
    initialRouteName: routes.NAVIGATION_HOME_SCREEN_PATH,
    defaultNavigationOptions: defaultHeader,
  },
);

const AuthStack = createStackNavigator(
  {
    [routes.NAVIGATION_LOGIN_PATH]: Login,
    [routes.NAVIGATION_SIGNIN_PATH]: Signin,
    [routes.NAVIGATION_RESET_PASSWORD_PATH]: PasswordReset,
  },
  {
    defaultNavigationOptions: defaultHeader,
  },
);

const AccountStack = createStackNavigator(
  {
    [routes.NAVIGATION_ACCOUNT_PATH]: Account,
    [routes.NAVIGATION_ORDERS_PATH]: OrdersScreen,
    [routes.NAVIGATION_ORDER_PATH]: OrderScreen,
    [routes.NAVIGATION_ADDRESS_SCREEN_PATH]: AddressScreen,
  },
  {
    defaultNavigationOptions: defaultHeader,
  },
);

const AccountSwitch = createSwitchNavigator({
  [routes.NAVIGATION_AUTH_LOADING_SWITCH]: AuthLoading,
  [routes.NAVIGATION_LOGIN_STACK_PATH]: AuthStack,
  [routes.NAVIGATION_ACCOUNT_STACK_PATH]: AccountStack,
});

const SearchStack = createStackNavigator(
  {
    [routes.NAVIGATION_SEARCH_SCREEN_PATH]: SearchScreen,
    [routes.NAVIGATION_SEARCH_PRODUCT_PATH]: ProductScreen,
  },
  {
    defaultNavigationOptions: defaultHeader,
  },
);

const CartStack = createStackNavigator(
  {
    [routes.NAVIGATION_CART_PATH]: Cart,
  },
  {
    defaultNavigationOptions: defaultHeader,
  },
);

const MainAppNavigator = createBottomTabNavigator(
  {
    [routes.NAVIGATION_HOME_STACK_PATH]: {
      screen: HomeStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-home" type="ionicon" color={tintColor} />
        ),
      }),
    },
    [routes.NAVIGATION_SEARCH_SCREEN_PATH]: {
      screen: SearchStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-search" type="ionicon" color={tintColor} />
        ),
      }),
    },
    [routes.NAVIGATION_AUTH_STACK_PATH]: {
      screen: AccountSwitch,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-person" type="ionicon" color={tintColor} />
        ),
      }),
    },
    [routes.NAVIGATION_CART_PATH]: {
      screen: CartStack,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => <CartBadge color={tintColor} />,
      }),
    },
  },
  {
    // initialRouteName: NAVIGATION_AUTH_STACK_PATH,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: theme.colors.secondary,
      inactiveTintColor: theme.colors.tabBarIconInactive,
      activeBackgroundColor: theme.colors.tabBarBackground,
      inactiveBackgroundColor: theme.colors.tabBarBackground,
    },
  },
);

const Drawer = createDrawerNavigator(
  {
    [routes.BOTTOM_TAB_NAVIGATOR]: {
      screen: MainAppNavigator,
    },
    [routes.NAVIGATION_DRAWER_SCREEN]: {
      screen: DrawerScreen,
      navigationOptions: { header: () => false },
    },
  },
  {
    contentComponent: CategoryTree,
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    Drawer,
  },
  {
    contentComponent: DrawerScreen,
    getCustomActionCreators: (route, stateKey) => ({
      toggleFilterDrawer: () => DrawerActions.toggleDrawer({ key: stateKey }),
    }),
  },
);

const CheckoutStack = createStackNavigator(
  {
    [routes.NAVIGATION_CHECKOUT_PATH]: Checkout,
  },
  {
    defaultNavigationOptions: defaultHeader,
  },
);

const Nav = createStackNavigator(
  {
    [routes.NAVIGATION_DRAWER_NAVIGATOR]: DrawerNavigator,
    [routes.NAVIGATION_CHECKOUT_STACK_PATH]: CheckoutStack,
  },
  {
    defaultNavigationOptions: { header: () => false },
  },
);

export const Navigator = createAppContainer(Nav);
