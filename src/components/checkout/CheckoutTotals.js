import React, { Component } from 'react';
import {
  Alert, View, Text, StyleSheet,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
  checkoutSetActiveSection,
} from '../../actions';
import { NAVIGATION_HOME_STACK_PATH } from '../../navigation/routes';
import { Button, Spinner } from '../common';
import Sizes from '../../constants/Sizes';

class CheckoutTotals extends Component {
  onPlacePressed = () => {
    const { cartId, selectedPayment } = this.props;
    const payment = {
      paymentMethod: {
        // po_number: selectedPayment.code,
        method: selectedPayment.code,
        // additional_data: [
        // 	"string"
        // ],
        // extension_attributes: {
        // 	agreement_ids: [
        // 		"string"
        // 	]
        // }
      },
    };
    this.props.checkoutCustomerNextLoading(true);
    this.props.placeGuestCartOrder(cartId, payment);
  }

  goHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Cart' })],
    });

    this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate(NAVIGATION_HOME_STACK_PATH);
  };

  renderTotals() {
    const { totals } = this.props;

    return (
      <View style={styles.totalsStyle}>
        <Text>
          Subtotals -
          {' '}
          {totals.subtotal_incl_tax}
          {' '}
          {totals.quote_currency_code}
        </Text>
        <Text>
          Shipping -
          {' '}
          {totals.shipping_incl_tax}
          {' '}
          {totals.quote_currency_code}
        </Text>
        <Text>
          Totals -
          {' '}
          {totals.grand_total}
          {' '}
          {totals.quote_currency_code}
        </Text>
      </View>
    );
  }

  renderButton() {
    const { payments } = this.props;
    if (!payments.length) {
      return <View />;
    }

    if (this.props.loading) {
      return (
        <View style={styles.nextButtonStyle}>
          <Spinner size="large" />
        </View>
      );
    }
    return (
      <View style={styles.nextButtonStyle}>
        <Button
          onPress={this.onPlacePressed}
          disable={this.props.loading}
          style={styles.buttonStyle}
        >
          Place Order
        </Button>
      </View>
    );
  }

  componentDidUpdate(prevProps): void {
    if (this.props.orderId && this.props.orderId !== prevProps.orderId) {
      this.showPopup('Order', 'Order placed successfully');
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      this.showPopup('Error', this.props.errorMessage);
    }
  }

  showPopup(title, message) {
    this.props.checkoutSetActiveSection(1);
    this.props.getCart();
    // this.props.checkoutOrderPopupShown();
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => this.goHome() }],
      { cancelable: false },
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTotals()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    alignItems: 'flex-start',
  },
  radioWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  nextButtonStyle: {
    flex: 1,
    alignSelf: 'center',
  },
  totalsStyle: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  buttonStyle: {
    marginTop: 10,
    alignSelf: 'center',
    width: Sizes.WINDOW_WIDTH * 0.9,
    marginBottom: 10,
  },
});

const mapStateToProps = ({ cart, checkout }) => {
  const { cartId } = cart;
  const { loading } = checkout.ui;
  const {
    payments, selectedPayment, totals, orderId, errorMessage,
  } = checkout;
  return {
    cartId, payments, selectedPayment, totals, loading, orderId, errorMessage,
  };
};

export default connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutSetActiveSection,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
})(CheckoutTotals);
