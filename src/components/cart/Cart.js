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
    const { totals } = styles;

    let sum = 0;
    if (items) {
      items.forEach(item => {
        sum += item.price * item.qty;
      });
    }

    if (sum > 0) {
      return (
        <Text style={totals}>
          Totals {sum.toFixed(2)}
        </Text>
      );
    }
  }

  renderEmptyCart = () => {
    const { navigate } = this.props.navigation;
    const {
      containerStyle,
      totals,
      buttonTextStyle
    } = styles;


    return (
      <View style={containerStyle}>
        <Text style={totals}>
          Your cart is empty
        </Text>
        <TouchableOpacity
          onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}
        >
          <Text style={buttonTextStyle}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderCart = () => {
    const { items } = this.props.cart;
    const {
      container,
      content,
      cartList,
      footer,
      buttonStyle
    } = styles;

    return (
      <View style={container}>
        <View style={content}>
          <View style={cartList}>
            <CartList items={items} />
          </View>
        </View>
        <View style={footer}>
          {this.renderTotals()}
          <Button
            onPress={this.onPressAddToCheckout}
            style={buttonStyle}
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
    fontSize: 20,
    paddingTop: 7,
  },
  buttonTextStyle: {
    padding: 14,
    fontSize: 20,
    top: 0,
    color: '#3478f6',
  },
  cartList: {},
  footer: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    width: Sizes.WINDOW_WIDTH * 0.5,
  },

});

const mapStateToProps = state => {
  const { products } = state.cart;

  return { cart: state.cart.quote, products };
};

export default connect(mapStateToProps, { cartItemProduct })(Cart);
