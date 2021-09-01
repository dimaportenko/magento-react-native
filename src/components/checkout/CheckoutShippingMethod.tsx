import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
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
import { StoreStateType } from '../../reducers';
import { ShippingItemType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart, checkout, magento }: StoreStateType) => {
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

const connector = connect(mapStateToProps, {
  getGuestCartShippingMethods,
  checkoutSelectedShippingChanged,
  addGuestCartShippingInfo,
  checkoutCustomerNextLoading,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};
type State = {};

class CheckoutShippingMethod extends Component<Props, State> {
  static contextType = ThemeContext;

  componentDidMount() {
    const { shipping, selectedShipping } = this.props;
    if (!selectedShipping && shipping?.length) {
      this.props.checkoutSelectedShippingChanged(shipping[0]);
    }
  }

  onShippingSelect(shipping: ShippingItemType) {
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

    const regionValue =
      typeof region === 'object'
        ? {
            region: region.region,
            region_id: region.regionId,
            region_code: region.regionCode,
          }
        : {
            region,
          };

    const address = {
      addressInformation: {
        shipping_address: {
          ...regionValue,
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
          ...regionValue,
          country_id: countryId,
          street: [street],
          telephone,
          postcode,
          city,
          firstname,
          lastname,
          email,
        },
        shipping_method_code: selectedShipping?.method_code,
        shipping_carrier_code: selectedShipping?.carrier_code,
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
        value: item.carrier_code,
      };
    });

    return (
      <RadioForm
        buttonColor={theme.colors.secondary}
        labelColor={theme.colors.bodyText}
        radio_props={radioProps}
        initial={0}
        animation={false}
        onPress={(value: string) => {
          const item = shipping.find(
            shippingItem => shippingItem.carrier_code === value,
          );
          this.onShippingSelect(item!);
        }}
      />
    );
  }

  renderButton() {
    const theme = this.context;
    const { shipping } = this.props;
    if (!shipping?.length) {
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
        {this.renderShippingMethods()}
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

export default connector(CheckoutShippingMethod);
