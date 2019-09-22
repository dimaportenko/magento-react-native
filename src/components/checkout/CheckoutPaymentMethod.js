import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import BTClient from 'react-native-braintree-xplat';
import { magento } from '../../magento';
import { Spinner, Button } from '../common';
import {
  checkoutSelectedPaymentChanged,
  checkoutSetActiveSection,
  getGuestCartPaymentMethods,
  checkoutCustomerNextLoading,
  updateCheckoutUI,
} from '../../actions';
import Sizes from '../../constants/Sizes';

class CheckoutPaymentMethod extends Component {
  static propTypes = {
    checkoutCustomerNextLoading: PropTypes.func,
    checkoutSelectedPaymentChanged: PropTypes.func,
    getGuestCartPaymentMethods: PropTypes.func,
    selectedPayment: PropTypes.shape({
      code: PropTypes.string,
    }),
    cartId: PropTypes.string || PropTypes.number,
    payments: PropTypes.array,
    loading: PropTypes.bool,
    updateCheckoutUI: PropTypes.func,
  };

  static defaultProps = {
  };

  componentWillMount() {
    const { payments, selectedPayment } = this.props;
    if (!selectedPayment && payments.length) {
      this.props.checkoutSelectedPaymentChanged(payments[0]);
    }
  }

  onPaymentSelect(payment) {
    this.props.checkoutSelectedPaymentChanged(payment);
  }

  onNextPressed = () => {
    const { cartId, selectedPayment } = this.props;

    // console.warn(selectedPayment.code)
    this.props.checkoutCustomerNextLoading(true);
    if (selectedPayment && selectedPayment.code === 'braintree') {
      this.processBraintree();
    } else if (selectedPayment && selectedPayment.code === 'braintree_cc_vault') {
      // this.processBraintreeVault();
    } else {
      this.props.getGuestCartPaymentMethods(cartId);
    }
  };

  processBraintree() {
    // try {
    //   this.processBillingAddress();
    // } catch (e) {
    //   this.props.updateCheckoutUI('error', 'There was a problem with your billing address. Please make sure it is correct.');
    //   this.props.checkoutCustomerNextLoading(false);
    //   return;
    // }

    const { card } = this.state;
    if (!card || !card.valid) {
      this.props.updateCheckoutUI('error', 'Invalid credit card data. Please review.');
      this.props.checkoutCustomerNextLoading(false);
    } else {
      this.getBraintreeCCNonce();
    }
  }

  getBraintreeCCNonce = async () => {
    try {
      const self = this;
      const { card } = this.state;
      const token = await magento.admin.getBraintreeToken();
      await BTClient.setup(token);

      const braintreeCC = {
        number: card.values.number,
        expirationDate: card.values.expiry, // or "10/2020" or any valid date
        cvv: card.values.cvc,
      };

      BTClient.getCardNonce(braintreeCC)
        .then((payment_method_nonce) => {
          self.props.paymentMethodNonce(payment_method_nonce);
          self.props.checkoutCustomerNextLoading(false);
          self.props.checkoutActivateSection(5);
        });
    } catch (e) {
      console.log(e);
      this.props.updateCheckoutUI('error', 'Credit Card data is invalid');
      this.props.checkoutCustomerNextLoading(false);
    }
  };

  renderPaymentMethods() {
    const { payments } = this.props;

    if (!payments || !payments.length) {
      return <Text>Payment methods not found</Text>;
    }

    const radioProps = payments.map(item => ({
      label: item.title,
      value: item,
    }));

    return (
      <RadioForm
        style={styles.radioWrap}
        radio_props={radioProps}
        initial={0}
        animation={false}
        onPress={(value) => { this.onPaymentSelect(value); }}
      />
    );
  }

  renderButton() {
    const { payments, checkout } = this.props;
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
          onPress={this.onNextPressed}
          style={styles.buttonStyle}
        >
              Next
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPaymentMethods()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
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
  buttonStyle: {
    marginTop: 10,
    alignSelf: 'center',
    width: Sizes.WINDOW_WIDTH * 0.9,
    marginBottom: 20,
  },
};

const mapStateToProps = ({ cart, checkout }) => {
  const { cartId } = cart;
  const { payments, selectedPayment } = checkout;
  const { loading } = checkout.ui;
  return {
    cartId, payments, selectedPayment, loading,
  };
};

export default connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutSetActiveSection,
  getGuestCartPaymentMethods,
  checkoutCustomerNextLoading,
  updateCheckoutUI,
})(CheckoutPaymentMethod);
