import React, { Component } from 'react';
import { Alert, View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common';
import NavigationService from '../../navigation/NavigationService';
import {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutOrderPopupShown,
  placeGuestCartOrder
} from '../../actions';
import { NAVIGATION_CATEGORY_TREE_PATH } from '../../navigation/routes';

class CheckoutTotals extends Component {
  onPlacePressed() {
    const { cartId, selectedPayment } = this.props;
    const payment = {
      paymentMethod: {
        // po_number: selectedPayment.code,
        method: selectedPayment.code
        // additional_data: [
        // 	"string"
        // ],
        // extension_attributes: {
        // 	agreement_ids: [
        // 		"string"
        // 	]
        // }
      }
    };
    this.props.checkoutCustomerNextLoading(true);
    this.props.placeGuestCartOrder(cartId, payment);
  }

  goHome = () => {
    NavigationService.navigate(NAVIGATION_CATEGORY_TREE_PATH, {
      title: 'Categories'
    });
  };

  renderTotals() {
    const { totals } = this.props;

    return (
      <View style={styles.totalsStyle}>
        <Text>
          Subtotals - {totals.subtotal_incl_tax} {totals.quote_currency_code}
        </Text>
        <Text>
          Shipping - {totals.shipping_incl_tax} {totals.quote_currency_code}
        </Text>
        <Text>
          Totals - {totals.grand_total} {totals.quote_currency_code}
        </Text>
      </View>
    );
  }

  renderButton() {
    const { payments } = this.props;
    if (!payments.length) {
      return <View />;
    }

    // if (this.props.loading) {
    //   return (
    //     <View style={styles.nextButtonStyle}>
    //       <Spinner size="large" />
    //     </View>
    //   );
    // }
    return (
      <View style={styles.nextButtonStyle}>
        <Button
          onPress={this.onPlacePressed.bind(this)}
          title="Place Order"
          disable={this.props.loading}
        />
      </View>
    );
  }

  renderPopup() {
    const { orderId } = this.props;
    if (orderId && !this.orderPopup) {
      this.orderPopup = true;
      // this.props.checkoutOrderPopupShown();
      Alert.alert(
        'Order',
        'Order placed successfully',
        [{ text: 'OK', onPress: () => this.goHome() }],
        { cancelable: false }
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTotals()}
        {this.renderButton()}
        {this.renderPopup()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    alignItems: 'flex-start'
  },
  radioWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start'
  },
  nextButtonStyle: {
    flex: 1,
    alignSelf: 'center'
  },
  totalsStyle: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  }
});

const mapStateToProps = ({ cart, checkout }) => {
  const { cartId } = cart;
  const { loading } = checkout.ui;
  const { payments, selectedPayment, totals, orderId } = checkout;
  return { cartId, payments, selectedPayment, totals, loading, orderId };
};

export default connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutOrderPopupShown,
  placeGuestCartOrder
})(CheckoutTotals);
