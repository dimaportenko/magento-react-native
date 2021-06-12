import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  getCountries,
  addGuestCartBillingAddress,
  createCustomer,
  updateCheckoutUI,
  checkoutCustomerNextLoading,
} from '../../actions';
import { Input, Spinner, ModalSelect, Button, Text } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

class CheckoutCustomerAccount extends Component {
  static contextType = ThemeContext;

  componentDidMount() {
    this.props.getCountries();
    // Hardcode US
    // this.props.updateCheckoutUI('countryId', 'US');
    // Clear the error
    this.props.updateCheckoutUI('error', false);
    // Clear loading
    this.props.checkoutCustomerNextLoading(false);

    const { customer } = this.props;
    if (customer) {
      this.updateUI('firstname', customer.firstname);
      this.updateUI('lastname', customer.lastname);
      this.updateUI('email', customer.email);
    }
    if (customer && customer.addresses && customer.addresses.length) {
      const address = customer.addresses[0];
      const regionData = address.region;
      const region = {
        regionCode: regionData.region_code,
        region: regionData.region,
        regionId: regionData.region_id,
      };
      this.updateUI('countryId', address.country_id);
      this.updateUI('region', region);
      if (address.firstname && address.firstname.length) {
        this.updateUI('firstname', address.firstname);
      }
      if (address.lastname && address.lastname.length) {
        this.updateUI('lastname', address.lastname);
      }
      this.updateUI('email', customer.email);
      this.updateUI('street', address.street.length ? address.street[0] : '');
      this.updateUI('city', address.city);
      this.updateUI('postcode', address.postcode);
      this.updateUI('telephone', address.telephone);
    }
  }

  onNextPressed = () => {
    const {
      email,
      password,
      postcode,
      countryId,
      firstname,
      lastname,
      telephone,
      city,
      street,
      region,
      cartId,
    } = this.props;

    const customer = {
      customer: {
        email,
        firstname,
        lastname,
        addresses: [
          {
            defaultShipping: true,
            defaultBilling: true,
            firstname,
            lastname,
            region,
            postcode,
            street: [street],
            city,
            telephone,
            countryId,
          },
        ],
      },
      password,
    };

    const regionValue =
      typeof region === 'object'
        ? {
            region: region.region,
            regionId: region.regionId,
            regionCode: region.regionCode,
          }
        : {
            region,
          };

    const address = {
      address: {
        // id: 0,
        region: regionValue.region,
        region_id: regionValue.regionId,
        region_code: regionValue.regionCode,
        country_id: countryId,
        street: [street],
        // company: 'test',
        telephone,
        // fax: 'test',
        postcode,
        city,
        firstname,
        lastname,
        // middlename: 'test',
        // prefix: 'test',
        // suffix: 'string',
        // vat_id: 'string',
        // customer_id: 0,
        email,
        same_as_billing: 1,
        // customer_address_id: 0,
        // save_in_address_book: 0,
        // "extension_attributes": {
        // 	"gift_registry_id": 0
        // },
        // "custom_attributes": [
        // 	{
        // 		"attribute_code": "string",
        // 		"value": "string"
        // 	}
        // ]
      },
      useForShipping: true,
    };

    // this.props.createCustomer(customer);
    this.props.checkoutCustomerNextLoading(true);
    this.props.addGuestCartBillingAddress(cartId, address);
  };

  updateUI = (key, value) => {
    this.props.updateCheckoutUI(key, value);
  };

  countrySelect(attributeId, optionValue) {
    this.props.updateCheckoutUI('countryId', optionValue);
  }

  regionSelect(attributeId, selectedRegion) {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length) {
      const country = countries.find(item => item.id === countryId);
      const regionData = country.available_regions.find(
        item => item.id === selectedRegion,
      );
      const region = {
        regionCode: regionData.code,
        region: regionData.name,
        regionId: regionData.id,
      };
      this.updateUI('region', region);
    }
  }

  renderButton() {
    const theme = this.context;
    if (this.props.loading) {
      return <Spinner size="large" />;
    }
    return (
      <View style={styles.nextButtonStyle}>
        <Button onPress={this.onNextPressed} style={styles.buttonStyle(theme)}>
          {translate('common.next')}
        </Button>
      </View>
    );
  }

  renderRegions() {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length && countries && countries.length) {
      const country = countries.find(item => item.id === countryId);
      if (country && country.available_regions) {
        const data = country.available_regions.map(value => ({
          label: value.name,
          key: value.id,
        }));

        return (
          <ModalSelect
            disabled={data.length === 0}
            key="regions"
            label={translate('common.region')}
            attribute={translate('common.region')}
            value={translate('common.region')}
            data={data}
            onChange={this.regionSelect.bind(this)}
          />
        );
      }
    }

    const regionValue =
      typeof this.props.region === 'string'
        ? this.props.region
        : this.props.region.region;
    return (
      <Input
        label={translate('common.region')}
        value={regionValue}
        placeholder={translate('common.region')}
        onChangeText={value => this.updateUI('region', value)}
      />
    );
  }

  renderCountries() {
    const { countries, countryId } = this.props;

    if (!countries || !countries.length) {
      return (
        <Input
          label={translate('common.country')}
          value={this.props.country}
          placeholder={translate('common.country')}
          onChangeText={value => this.updateUI('country', value)}
        />
      );
    }

    const data = countries.map(value => ({
      label: value.full_name_locale,
      key: value.id,
    }));

    return (
      <ModalSelect
        disabled={data.length === 0}
        key="countries"
        label={translate('common.country')}
        attribute={translate('common.country')}
        value={translate('common.country')}
        data={data}
        onChange={this.countrySelect.bind(this)}
      />
    );
  }

  renderUser() {
    if (this.props.customer) {
      return;
    }

    return (
      <View>
        <Input
          autoCapitalize="none"
          label={translate('common.email')}
          value={this.props.email}
          placeholder={translate('common.email')}
          onChangeText={value => this.updateUI('email', value)}
        />

        <Input
          secureTextEntry
          label={translate('common.password')}
          value={this.props.password}
          placeholder={translate('common.password')}
          onChangeText={value => this.updateUI('password', value)}
        />

        <Input
          label={translate('common.firstName')}
          value={this.props.firstname}
          placeholder={translate('common.firstName')}
          onChangeText={value => this.updateUI('firstname', value)}
        />

        <Input
          label={translate('common.lastName')}
          value={this.props.lastname}
          placeholder={translate('common.lastName')}
          onChangeText={value => this.updateUI('lastname', value)}
        />
      </View>
    );
  }

  render() {
    const theme = this.context;
    return (
      <View style={styles.container(theme)}>
        {this.renderUser()}

        {this.renderCountries()}

        {this.renderRegions()}

        <Input
          label={translate('common.postcode')}
          value={this.props.postcode}
          placeholder={translate('common.postcode')}
          onChangeText={value => this.updateUI('postcode', value)}
        />

        <Input
          label={translate('common.street')}
          value={this.props.street}
          placeholder={translate('common.street')}
          onChangeText={value => this.updateUI('street', value)}
        />

        <Input
          label={translate('common.city')}
          value={this.props.city}
          placeholder={translate('common.city')}
          onChangeText={value => this.updateUI('city', value)}
        />

        <Input
          label={translate('common.telephone')}
          value={this.props.telephone}
          placeholder={translate('common.telephone')}
          onChangeText={value => this.updateUI('telephone', value)}
        />

        <Text type="heading" style={styles.errorTextStyle(theme)}>
          {this.props.error}
        </Text>

        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    padding: theme.spacing.large,
  }),
  errorTextStyle: theme => ({
    color: theme.colors.error,
    alignSelf: 'center',
  }),
  nextButtonStyle: {
    flex: 1,
    alignItems: 'center',
  },
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
});

const mapStateToProps = ({ checkout, cart, account, magento }) => {
  const { countries } = magento;
  const { cartId } = cart;
  const { customer } = account;

  return {
    ...checkout.ui,
    cartId,
    countries,
    customer,
  };
};

export default connect(mapStateToProps, {
  getCountries,
  updateCheckoutUI,
  addGuestCartBillingAddress,
  checkoutCreateCustomer: createCustomer,
  checkoutCustomerNextLoading,
})(CheckoutCustomerAccount);
