import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import { Spinner, Text, Button } from '../common';
import {
  getGuestCartShippingMethods,
  checkoutSelectedShippingChanged,
  addGuestCartShippingInfo,
  checkoutCustomerNextLoading,
} from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

class CheckoutShippingMethod extends Component {
  static contextType = ThemeContext;

  componentDidMount() {
    const { shipping, selectedShipping } = this.props;
    if (!selectedShipping && shipping.length) {
      this.props.checkoutSelectedShippingChanged(shipping[0]);
    }
  }

  onShippingSelect(shipping) {
    console.log('shipping selected');
    console.log(shipping);
    this.props.checkoutSelectedShippingChanged(shipping);
  }

  onNextPressed = () => {
    const {
      email,
      postcode,
      countryId,
      firstname,
      lastname,
      telephone,
      city,
      street,
      region,
      cartId,
      selectedShipping,
    } = this.props;

    const address = {
      addressInformation: {
        shipping_address: {
          region: region.region,
          region_id: region.regionId,
          region_code: region.regionCode,
          country_id: countryId,
          street: [street],
          telephone,
          postcode,
          city,
          firstname,
          lastname,
          email,
        },
        billing_address: {
          region: region.region,
          region_id: region.regionId,
          region_code: region.regionCode,
          country_id: countryId,
          street: [street],
          telephone,
          postcode,
          city,
          firstname,
          lastname,
          email,
        },
        shipping_method_code: selectedShipping.method_code,
        shipping_carrier_code: selectedShipping.carrier_code,
        extension_attributes: {},
      },
    };

    this.props.checkoutCustomerNextLoading(true);
    this.props.addGuestCartShippingInfo(cartId, address);
  };

  renderShippingMethods() {
    const theme = this.context;
    const { shipping, currencySymbol, currencyRate } = this.props;

    if (!shipping || !shipping.length) {
      return <Text>{translate('checkout.noShippingMethod')}</Text>;
    }

    const radioProps = shipping.map(item => {
      const label = `${item.carrier_title} - ${item.method_title} - ${
        currencySymbol + (item.base_amount * currencyRate).toFixed(2)
      }`;
      return {
        label,
        value: item,
      };
    });

    return (
      <RadioForm
        buttonColor={theme.colors.secondary}
        labelColor={theme.colors.bodyText}
        selectedLabelColor={theme.colors.titleText}
        style={styles.radioWrap}
        radio_props={radioProps}
        initial={0}
        animation={false}
        onPress={value => {
          this.onShippingSelect(value);
        }}
      />
    );
  }

  renderButton() {
    const theme = this.context;
    const { shipping } = this.props;
    if (!shipping.length) {
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
        {this.renderShippingMethods()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
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
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
};

const mapStateToProps = ({ cart, checkout, magento }) => {
  const {
    email,
    password,
    postcode,
    country,
    countryId,
    firstname,
    lastname,
    telephone,
    city,
    street,
    region,
    loading,
  } = checkout.ui;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = magento;

  const { shipping, selectedShipping } = checkout;
  const { cartId } = cart;

  return {
    email,
    password,
    postcode,
    country,
    countryId,
    firstname,
    lastname,
    telephone,
    city,
    street,
    region,
    cartId,
    loading,
    shipping,
    selectedShipping,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, {
  getGuestCartShippingMethods,
  checkoutSelectedShippingChanged,
  addGuestCartShippingInfo,
  checkoutCustomerNextLoading,
})(CheckoutShippingMethod);
