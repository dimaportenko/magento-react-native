import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CartList from './CartList';
import { cartItemProduct } from '../../actions';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_CHECKOUT_PATH,
  NAVIGATION_HOME_SCREEN_PATH
} from '../../navigation/routes';
import { Button } from '../common';
import Sizes from '../../constants/Sizes';

class Cart extends Component {
  static navigationOptions = {
    title: 'Cart',
    headerBackTitle: ' '
  };

  static propTypes = {
    cart: PropTypes.object,
    products: PropTypes.object,
    cartItemProduct: PropTypes.func,
  };

  static defaultProps = {
    cart: {},
    products: {},
  };

  componentDidMount() {
    const { items } = this.props.cart;
    const { products } = this.props;

    if (!items) {
      return;
    }
    items.forEach(item => {
      if (!item.thumbnail) {
        if (!products[item.sku]) {
          this.props.cartItemProduct(item.sku);
        }
      }
    });
  }

  onPressAddToCheckout = () => {
    NavigationService.navigate(NAVIGATION_CHECKOUT_PATH, {
      title: 'Cart'
    });
  }

  renderTotals() {
    const { items } = this.props.cart;

    let sum = 0;
    if (items) {
      items.forEach(item => {
        sum += item.price * item.qty;
      });
    }

    if (sum > 0) {
      return (
        <Text style={styles.totals}>
          Totals {sum.toFixed(2)}
        </Text>
      );
    }

    return (
      <View style={styles.containerStyle}>
        <Text style={styles.totals}>
          Your cart is empty
        </Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(NAVIGATION_HOME_SCREEN_PATH)}
        >
          <Text style={styles.buttonTextStyle}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderButton = () => {
    const { items } = this.props.cart;
    if (items && items.length) {
      return (
        <Button
          onPress={this.onPressAddToCheckout}
          style={styles.buttonStyle}
        >
          Go to Checkout
        </Button>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.cartList}>
            <CartList items={this.props.cart.items} />
          </View>
          {this.renderTotals()}
        </View>
        <View style={styles.footer}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  totals: {
    padding: 14,
    fontSize: 20,
    top: 0
  },
  buttonTextStyle: {
    padding: 14,
    fontSize: 20,
    top: 0,
    color: '#3478f6',
  },
  cartList: {},
  footer: {
    alignItems: 'center',
    height: 50
  },
  buttonStyle: {
    alignSelf: 'center',
    width: Sizes.WINDOW_WIDTH * 0.9,
    marginBottom: 50,
  }
});

const mapStateToProps = state => {
  const { products } = state.cart;

  return { cart: state.cart.quote, products };
};

export default connect(mapStateToProps, { cartItemProduct })(Cart);
