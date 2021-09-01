import React, { Component } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import { Spinner, Button } from '../common';
import {
  checkoutSelectedPaymentChanged,
  checkoutSetActiveSection,
  getGuestCartPaymentMethods,
  checkoutCustomerNextLoading,
} from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { PaymentItemType } from '../../reducers/CheckoutReducer';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart, checkout }: StoreStateType) => {
  const { cartId } = cart;
  const { payments, selectedPayment } = checkout;
  const { loading } = checkout.ui;
  return {
    cartId,
    payments,
    selectedPayment,
    loading,
  };
};

const connector = connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutSetActiveSection,
  getGuestCartPaymentMethods,
  checkoutCustomerNextLoading,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};
type State = {};

class CheckoutPaymentMethod extends Component<Props, State> {
  static contextType = ThemeContext;

  componentDidMount() {
    const { payments, selectedPayment } = this.props;
    if (!selectedPayment && payments?.length) {
      this.props.checkoutSelectedPaymentChanged(payments[0]);
    }
  }

  onPaymentSelect(payment: PaymentItemType) {
    this.props.checkoutSelectedPaymentChanged(payment);
  }

  onNextPressed = () => {
    const { cartId } = this.props;
    this.props.checkoutCustomerNextLoading(true);
    this.props.getGuestCartPaymentMethods(cartId);
  };

  renderPaymentMethods() {
    const theme = this.context;
    const { payments } = this.props;

    if (!payments || !payments.length) {
      return <Text>{translate('checkout.noPaymentMethod')}</Text>;
    }

    const radioProps = payments.map(item => ({
      label: item.title,
      value: item.code,
    }));

    return (
      <RadioForm
        buttonColor={theme.colors.secondary}
        labelColor={theme.colors.bodyText}
        radio_props={radioProps}
        initial={0}
        animation={false}
        onPress={(value: string) => {
          const item = payments.find(item => item.code === value);
          this.onPaymentSelect(item!);
        }}
      />
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
        <View style={sh.nextButtonStyle}>
          <Spinner size="large" />
        </View>
      );
    }
    return (
      <View style={sh.nextButtonStyle}>
        <Button onPress={this.onNextPressed} style={styles.buttonStyle(theme)}>
          {translate('common.next')}
        </Button>
      </View>
    );
  }

  render() {
    const theme = this.context;
    return (
      <View style={styles.container(theme)}>
        {this.renderPaymentMethods()}
        {this.renderButton()}
      </View>
    );
  }
}

const sh = StyleSheet.create({
  radioWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  nextButtonStyle: {
    flex: 1,
    alignSelf: 'center',
  },
});

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    margin: theme.spacing.large,
    alignItems: 'flex-start',
  }),
  buttonStyle: (theme: ThemeType): ViewStyle => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
};

export default connector(CheckoutPaymentMethod);
