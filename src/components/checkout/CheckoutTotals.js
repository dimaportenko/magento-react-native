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
import { Button, Spinner, Text, Price } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';

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
    const {
      totals: {
        base_currency_code: baseCurrencyCode,
        base_subtotal: baseSubTotal,
        base_grand_total: grandTotal,
        base_shipping_incl_tax: shippingTotal,
      },
      baseCurrencySymbol,
      currencyCode,
      currencySymbol,
      currencyRate,
    } = this.props;

    return (
      <View style={styles.totalsStyle}>
        <View style={styles.row}>
          <Text>
            {`${translate('common.subTotal')}: `}
          </Text>
          <Price
            basePrice={baseSubTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {`${translate('common.shipping')}: `}
          </Text>
          <Price
            basePrice={shippingTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {`${translate('common.total')}: `}
          </Text>
          <Price
            basePrice={grandTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {
          baseCurrencyCode !== currencyCode && (
            <View style={styles.row}>
              <Text>{`${translate('checkout.youWillBeCharged')}: `}</Text>
              <Price
                basePrice={grandTotal}
                currencySymbol={baseCurrencySymbol || priceSignByCode(baseCurrencyCode)}
                currencyRate={1}
              />
            </View>
          )
        }
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
  row: {
    flexDirection: 'row',
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

const mapStateToProps = ({ cart, checkout, magento }) => {
  const { cartId } = cart;
  const { loading } = checkout.ui;
  const {
    payments, selectedPayment, totals, orderId, errorMessage,
  } = checkout;
  const {
    base_currency_symbol: baseCurrencySymbol,
    displayCurrencyCode: currencyCode,
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    cartId,
    payments,
    selectedPayment,
    totals,
    loading,
    orderId,
    errorMessage,
    baseCurrencySymbol,
    currencyCode,
    currencySymbol,
    currencyRate,
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
