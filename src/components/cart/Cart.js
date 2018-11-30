import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import CartList from './CartList';
import { cartItemProduct } from '../../actions';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_CHECKOUT_PATH } from '../../navigation/routes';

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

  componentWillMount() {
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

  onPressAddToCheckout() {
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

    return sum.toFixed(2);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.cartList}>
            <CartList items={this.props.cart.items} />
          </View>
          <Text style={styles.totals}>Totals {this.renderTotals()}</Text>
        </View>
        <View style={styles.footer}>
          <Button
            onPress={this.onPressAddToCheckout.bind(this)}
            title="Go to Checkout"
          />
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
  content: {
    flex: 1
  },
  totals: {
    padding: 14,
    fontSize: 20,
    top: 0
  },
  cartList: {},
  footer: {
    alignItems: 'center',
    height: 50
  }
});

const mapStateToProps = state => {
  const { products } = state.cart;

  return { cart: state.cart.quote, products };
};

export default connect(mapStateToProps, { cartItemProduct })(Cart);
