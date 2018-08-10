import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  getCountries,
  addGuestCartBillingAddress,
  createCustomer,
  updateCheckoutUI,
  checkoutCustomerNextLoading,
} from '../../actions';
import { CardSection, Input, Spinner, ModalSelect } from '../common';


class CheckoutCustomerAccount extends Component {
  componentWillMount() {
    this.props.getCountries();
  }

  onNextPressed() {
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

    const address = {
      address: {
        // id: 0,
        region: region.region,
        region_id: region.regionId,
        region_code: region.regionCode,
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
  }

  updateUI = (key, value) => {
    this.props.updateCheckoutUI(key, value);
  };

  countrySelect(attributeId, optionValue) {
    this.props.updateCheckoutUI('countryId', optionValue);
  }

  regionSelect(attributeId, selectedRegion) {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length) {
      const country = countries.find(item => {
        return item.id === countryId;
      });
      const regionData = country.available_regions.find(item => {
        return item.id === selectedRegion;
      });
      const region = {
        regionCode: regionData.code,
        region: regionData.name,
        regionId: regionData.id,
      };
      this.updateUI('region', region);
    }
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }
    return (
      <View style={styles.nextButtonStyle}>
        <Button onPress={this.onNextPressed.bind(this)} title="Next" />
      </View>
    );
  }

  renderRegions() {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length) {
      const country = countries.find(item => {
        return item.id === countryId;
      });
      if (country.available_regions) {
        const data = country.available_regions.map(value => {
          return {
            label: value.name,
            key: value.id,
          };
        });

        return (
          <ModalSelect
            disabled={data.length === 0}
            key="regions"
            label="Region"
            attribute="Region"
            value="Region"
            data={data}
            onChange={this.regionSelect.bind(this)}
          />
        );
      }
    }

    return (
      <Input
        label="Region"
        value={this.props.region}
        placeholder="region"
        onChangeText={value => this.updateUI('region', value)}
      />
    );
  }

  renderCountries() {
    const { countries, countryId } = this.props;

    if (!countries || !countries.length) {
      return (
        <Input
          label="Country"
          value={this.props.country}
          placeholder="country"
          onChangeText={value => this.updateUI('country', value)}
        />
      );
    }

    const data = countries.map(value => {
      return {
        label: value.full_name_locale,
        key: value.id,
      };
    });

    const country = countries.find(item => {
      return item.id === countryId;
    });
    const label = country ? country.full_name_locale : 'Country';

    return (
      <ModalSelect
        disabled={data.length === 0}
        key="countries"
        label={label}
        attribute="Country"
        value="Country"
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
        <CardSection>
          <Input
            label="Email"
            value={this.props.email}
            placeholder="email@gmail.com"
            onChangeText={value => this.updateUI('email', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Password"
            value={this.props.password}
            placeholder="password"
            onChangeText={value => this.updateUI('password', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Firstname"
            value={this.props.firstname}
            placeholder="firstname"
            onChangeText={value => this.updateUI('firstname', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Lastname"
            value={this.props.lastname}
            placeholder="lastname"
            onChangeText={value => this.updateUI('lastname', value)}
          />
        </CardSection>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderUser()}

        <CardSection>{this.renderCountries()}</CardSection>

        <CardSection>{this.renderRegions()}</CardSection>

        <CardSection>
          <Input
            label="Postcode"
            value={this.props.postcode}
            placeholder="postcode"
            onChangeText={value => this.updateUI('postcode', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Street"
            value={this.props.street}
            placeholder="street"
            onChangeText={value => this.updateUI('street', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            label="City"
            value={this.props.city}
            placeholder="city"
            onChangeText={value => this.updateUI('city', value)}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Telephone"
            value={this.props.telephone}
            placeholder="telephone"
            onChangeText={value => this.updateUI('telephone', value)}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.props.error}</Text>

        <CardSection>{this.renderButton()}</CardSection>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorTextStyle: {
    color: 'red',
    fontSize: 20,
    alignSelf: 'center',
  },
  nextButtonStyle: {
    flex: 1,
    alignItems: 'center',
  },
});

const mapStateToProps = ({ checkout, cart, account }) => {
  const { countries } = checkout;
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
