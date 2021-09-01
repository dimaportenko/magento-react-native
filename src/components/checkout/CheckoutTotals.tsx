import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
  resetCart,
  checkoutSetActiveSection,
  removeCouponFromCart,
  addCouponToCart,
} from '../../actions';
import { NAVIGATION_HOME_STACK_PATH } from '../../navigation/routes';
import { Button, Spinner, Text, Price } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';
import { Spacer } from '../common/Spacer';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart, checkout, magento }: StoreStateType) => {
  const { cartId, couponLoading, couponError } = cart;
  const { loading } = checkout.ui;
  const { payments, selectedPayment, totals, orderId, errorMessage } = checkout;
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
    couponError,
    couponLoading,
  };
};

const connector = connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutSetActiveSection,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
  resetCart,
  addCouponToCart,
  removeCouponFromCart,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

type State = {};

class CheckoutTotals extends Component<Props, State> {
  static contextType = ThemeContext;

  state = {
    couponCodeInput: '',
  };

  onPlacePressed = () => {
    const { cartId, selectedPayment } = this.props;
    const payment = {
      paymentMethod: {
        // po_number: selectedPayment.code,
        method: selectedPayment?.code,
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
  };

  goHome = () => {
    this.props.navigation.navigate(NAVIGATION_HOME_STACK_PATH);
  };

  renderTotals() {
    const {
      totals,
      baseCurrencySymbol,
      currencyCode,
      currencySymbol,
      currencyRate,
    } = this.props;

    if (!totals) {
      return;
    }
    const {
      base_currency_code: baseCurrencyCode,
      base_subtotal: baseSubTotal,
      base_grand_total: grandTotal,
      base_shipping_incl_tax: shippingTotal,
    } = totals;

    return (
      <View style={styles.totalsStyle}>
        <View style={styles.row}>
          <Text>{`${translate('common.subTotal')}: `}</Text>
          <Price
            basePrice={baseSubTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {!!this.props?.totals?.coupon_code && (
          <View style={styles.row}>
            <Text>{`${translate('common.discount')}: `}</Text>
            <Price
              basePrice={this.props?.totals?.discount_amount}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </View>
        )}
        <View style={styles.row}>
          <Text>{`${translate('common.shipping')}: `}</Text>
          <Price
            basePrice={shippingTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>{`${translate('common.total')}: `}</Text>
          <Price
            basePrice={grandTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {baseCurrencyCode !== currencyCode && (
          <View style={styles.row}>
            <Text>{`${translate('checkout.youWillBeCharged')}: `}</Text>
            <Price
              basePrice={grandTotal}
              currencySymbol={
                baseCurrencySymbol || priceSignByCode(baseCurrencyCode)
              }
              currencyRate={1}
            />
          </View>
        )}
      </View>
    );
  }

  renderButton() {
    const theme = this.context;
    const { payments } = this.props;
    if (!payments?.length) {
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
          disabled={this.props.loading}
          style={buttonStyle(theme)}>
          {translate('checkout.placeOrderButton')}
        </Button>
      </View>
    );
  }

  componentDidMount() {
    if (this.props?.totals?.coupon_code) {
      this.setState({
        couponCodeInput: this.props?.totals?.coupon_code,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.orderId && this.props.orderId !== prevProps.orderId) {
      this.showPopup(
        translate('common.order'),
        translate('checkout.orderSuccessMessage'),
      );
    }
    if (
      this.props.errorMessage &&
      this.props.errorMessage !== prevProps.errorMessage
    ) {
      this.showPopup(translate('errors.error'), this.props.errorMessage);
    }
    if (this.props?.totals?.coupon_code !== prevProps?.totals?.coupon_code) {
      this.setState({
        couponCodeInput: this.props?.totals?.coupon_code,
      });
    }
  }

  showPopup(title: string, message: string) {
    this.props.checkoutSetActiveSection(1);
    this.props.resetCart();
    // this.props.checkoutOrderPopupShown();
    Alert.alert(
      title,
      message,
      [{ text: translate('common.ok'), onPress: () => this.goHome() }],
      { cancelable: false },
    );
  }

  couponAction = () => {
    if (this.props?.totals?.coupon_code) {
      this.props.removeCouponFromCart();
    } else {
      this.props.addCouponToCart(this.state.couponCodeInput);
    }
  };

  renderCoupon = () => {
    const theme = this.context;

    return (
      <View>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={couponInputContainer(theme)}>
            <TextInput
              // style={{ width: '100%' }}
              editable={!this.props?.totals?.coupon_code}
              value={this.state.couponCodeInput}
              placeholder="Coupon Code"
              onChangeText={value => this.setState({ couponCodeInput: value })}
            />
          </View>
          <Spacer size={50} />
          {this.props.couponLoading ? (
            <View style={{ width: 100 }}>
              <Spinner />
            </View>
          ) : (
            <Button
              onPress={this.couponAction}
              style={{ width: 100, alignSelf: 'auto' }}>
              {this.props?.totals?.coupon_code ? 'Cancel' : 'Apply'}
            </Button>
          )}
        </View>
        {!!this.props.couponError?.length && (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
            {this.props.couponError}
          </Text>
        )}
      </View>
    );
  };

  render() {
    const theme = this.context;
    return (
      <View style={container(theme)}>
        {this.renderCoupon()}
        {this.renderTotals()}
        {this.renderButton()}
      </View>
    );
  }
}

const container = (theme: ThemeType): ViewStyle => ({
  margin: theme.spacing.large,
  alignItems: 'flex-start',
});
const buttonStyle = (theme: ThemeType): ViewStyle => ({
  marginVertical: theme.spacing.large,
  alignSelf: 'center',
  width: theme.dimens.WINDOW_WIDTH * 0.9,
});
const couponInputContainer = (theme: ThemeType) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  marginBottom: 20,
  padding: 10,
  width: Dimensions.get('window').width - 100 - 30 - 50,
});

const styles = StyleSheet.create({
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
});

export default connector(CheckoutTotals);
