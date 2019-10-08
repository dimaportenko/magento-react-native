import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { cartItemProduct, getCart } from '../../actions';
import CartListItem from './CartListItem';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_CHECKOUT_PATH,
  NAVIGATION_HOME_SCREEN_PATH,
} from '../../navigation/routes';
import { Button, Text } from '../common';
import { ThemeContext } from '../../theme';

class Cart extends Component {
  static contextType = ThemeContext;

  static navigationOptions = {
    title: 'Cart',
    headerBackTitle: ' ',
  };

  static propTypes = {
    cart: PropTypes.object,
    products: PropTypes.object,
    cartItemProduct: PropTypes.func,
    getCart: PropTypes.func,
    refreshing: PropTypes.bool,
  };

  static defaultProps = {
    cart: {},
    products: {},
    refreshing: false,
  };

  componentDidMount() {
    this.updateCartItemsProducts();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.cart.items
      && this.props.cart.items
      && prevProps.cart.items.length !== this.props.cart.items.length
    ) {
      this.updateCartItemsProducts();
    }
  }

  onPressAddToCheckout = () => {
    NavigationService.navigate(NAVIGATION_CHECKOUT_PATH, {
      title: 'Cart',
    });
  };

  onRefresh = () => {
    this.props.getCart(true);
  };

  updateCartItemsProducts = () => {
    const { items } = this.props.cart;

    if (!items) {
      return;
    }

    const { products } = this.props;

    items.forEach((item) => {
      if (!item.thumbnail) {
        if (!products[item.sku]) {
          this.props.cartItemProduct(item.sku);
        }
      }
    });
  };

  renderTotals() {
    const theme = this.context;
    const { items } = this.props.cart;
    const { totals } = styles;

    let sum = 0;
    if (items) {
      items.forEach((item) => {
        sum += item.price * item.qty;
      });
    }

    if (sum > 0) {
      return (
        <Text type="heading" style={totals(theme)}>
          Totals
          {' '}
          {sum.toFixed(2)}
        </Text>
      );
    }
  }

  renderEmptyCart = () => {
    const theme = this.context;
    const { navigate } = this.props.navigation;
    const {
      containerStyle,
      totals,
      buttonTextStyle,
    } = styles;


    return (
      <View style={containerStyle(theme)}>
        <Text type="heading" style={totals(theme)}>
          Your cart is empty
        </Text>
        <TouchableOpacity
          onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}
        >
          <Text type="heading" bold style={buttonTextStyle(theme)}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = items => <CartListItem item={items.item} expanded={false} />

  renderCart = () => {
    const theme = this.context;
    const { items } = this.props.cart;
    const {
      container,
      content,
      footer,
      buttonStyle,
    } = styles;

    return (
      <View style={container(theme)}>
        <View style={content}>
          <FlatList
            refreshControl={(
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this.onRefresh}
              />
            )}
            data={[...items]}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={footer(theme)}>
          {this.renderTotals()}
          <Button
            onPress={this.onPressAddToCheckout}
            style={buttonStyle(theme)}
          >
            Go to Checkout
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const { items } = this.props.cart;

    if (items && items.length) {
      return this.renderCart();
    }
    return this.renderEmptyCart();
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  containerStyle: theme => ({
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  content: {
    flex: 1,
  },
  totals: theme => ({
    paddingTop: theme.spacing.small,
  }),
  buttonTextStyle: theme => ({
    padding: theme.spacing.large,
    top: 0,
    color: theme.colors.secondary,
  }),
  footer: theme => ({
    padding: theme.spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }),
  buttonStyle: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.5,
  }),
});

const mapStateToProps = ({ cart }) => {
  const { products } = cart;
  return {
    cart: cart.quote,
    refreshing: cart.refreshing,
    products,
  };
};

export default connect(mapStateToProps, { cartItemProduct, getCart })(Cart);
