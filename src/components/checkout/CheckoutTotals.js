import React, { Component } from 'react';
import {
  Alert, View, StyleSheet,
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
import { Button, Spinner, Text } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

class CheckoutTotals extends Component {
  static contextType = ThemeContext;

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
          {`${translate('common.subTotal')} - ${totals.subtotal_incl_tax} ${totals.quote_currency_code}`}
        </Text>
        <Text>
          {`${translate('common.shipping')} - ${totals.shipping_incl_tax} ${totals.quote_currency_code}`}
        </Text>
        <Text>
          {`${translate('common.total')} - ${totals.grand_total} ${totals.quote_currency_code}`}
        </Text>
      </View>
    );
  }

  renderButton() {
    const theme = this.context;
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
          style={styles.buttonStyle(theme)}
        >
          {translate('checkout.placeOrderButton')}
        </Button>
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.orderId && this.props.orderId !== prevProps.orderId) {
      this.showPopup(translate('common.order'), translate('checkout.orderSuccessMessage'));
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      this.showPopup(translate('errors.error'), this.props.errorMessage);
    }
  }

  showPopup(title, message) {
    this.props.checkoutSetActiveSection(1);
    this.props.getCart();
    // this.props.checkoutOrderPopupShown();
    Alert.alert(
      title,
      message,
      [{ text: translate('common.ok'), onPress: () => this.goHome() }],
      { cancelable: false },
    );
  }

  render() {
    const theme = this.context;
    return (
      <View style={styles.container(theme)}>
        {this.renderTotals()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    margin: theme.spacing.large,
    alignItems: 'flex-start',
  }),
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
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
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
