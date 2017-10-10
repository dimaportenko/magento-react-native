import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import ProductList from '../components/catalog/ProductList';
import CategoryTree from '../components/CategoryTree';
import Product from '../components/catalog/Product';
import Cart from '../components/cart/Cart';
import Checkout from '../components/checkout/Checkout';

export const AppNavigator = StackNavigator({
	CategoryTree: { screen: CategoryTree },
	Category: { screen: ProductList },
	Product: { screen: Product },
	Cart: { screen: Cart },
	Checkout: { screen: Checkout }
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
