import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  getCountries,
  addAccountAddress,
  updateAccountAddressUI,
  accountAddressNextLoading,
  resetAccountAddressUI,
} from '../../actions';
import { Input, Spinner, ModalSelect, Button, Text } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

class AddAccountAddress extends Component {
  static contextType = ThemeContext;

  componentWillUnmount() {
    this.props.updateAccountAddressUI('error', false);
  }

  componentDidMount() {
    this.props.getCountries();
    this.props.resetAccountAddressUI();

    if (
      this.props.customer &&
      this.props.customer.addresses &&
      this.props.customer.addresses.length
    ) {
      const address = this.props.customer.addresses[0];
      const regionData = address.region;
      const region = {
        regionCode: regionData.region_code,
        region: regionData.region,
        regionId: regionData.region_id,
      };
      this.updateUI('region', region);
      this.updateUI('countryId', address.country_id);
      this.updateUI('street', address.street.length ? address.street[0] : '');
      this.updateUI('city', address.city);
      this.updateUI('postcode', address.postcode);
      this.updateUI('telephone', address.telephone);
    }
  }

  onNextPressed = () => {
    const { postcode, countryId, city, street, region, customer, telephone } =
      this.props;

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

    const data = {
      customer: {
        ...customer,
        addresses: [
          {
            region: regionValue,
            country_id: countryId,
            street: [street],
            postcode,
            city,
            // same_as_billing: 1,
            firstname: customer.firstname,
            lastname: customer.lastname,
            telephone,
          },
        ],
      },
    };

    this.props.updateAccountAddressUI('error', false);
    this.props.accountAddressNextLoading(true);
    this.props.addAccountAddress(customer.id, data);
    // this.props.resetAccountAddressUI();
  };

  updateUI = (key, value) => {
    this.props.updateAccountAddressUI(key, value);
  };

  countrySelect = (attributeId, optionValue) => {
    this.props.updateAccountAddressUI('countryId', optionValue);
  };

  regionSelect = (attributeId, selectedRegion) => {
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
  };

  renderButton = () => {
    const theme = this.context;
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button onPress={this.onNextPressed} style={styles.buttonStyle(theme)}>
        {translate('common.update')}
      </Button>
    );
  };

  renderRegions = () => {
    const theme = this.context;
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
            attribute="Region"
            value="Region"
            data={data}
            onChange={this.regionSelect}
            style={styles.inputContainer(theme)}
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
        value={regionValue}
        placeholder={translate('common.region')}
        onChangeText={value => this.updateUI('region', value)}
        containerStyle={styles.inputContainer(theme)}
      />
    );
  };

  renderCountries = () => {
    const theme = this.context;
    const { countries, countryId } = this.props;

    if (!countries || !countries.length) {
      return (
        <Input
          value={this.props.country}
          placeholder={translate('common.country')}
          onChangeText={value => this.updateUI('country', value)}
          containerStyle={styles.inputContainer(theme)}
        />
      );
    }

    const data = countries.map(value => ({
      label: value.full_name_locale,
      key: value.id,
    }));

    const country = countries.find(item => item.id === countryId);
    const label = country
      ? country.full_name_locale
      : translate('common.country');

    return (
      <ModalSelect
        disabled={data.length === 0}
        key="countries"
        label={label}
        attribute={translate('common.country')}
        value={translate('common.country')}
        data={data}
        onChange={this.countrySelect}
        style={styles.inputContainer(theme)}
      />
    );
  };

  render() {
    const theme = this.context;
    return (
      <View style={styles.container(theme)}>
        {this.renderCountries()}

        {this.renderRegions()}

        <Input
          value={this.props.postcode}
          placeholder={translate('common.postcode')}
          onChangeText={value => this.updateUI('postcode', value)}
          containerStyle={styles.inputContainer(theme)}
        />

        <Input
          value={this.props.street}
          placeholder={translate('common.street')}
          onChangeText={value => this.updateUI('street', value)}
          containerStyle={styles.inputContainer(theme)}
        />

        <Input
          value={this.props.city}
          placeholder={translate('common.city')}
          onChangeText={value => this.updateUI('city', value)}
          containerStyle={styles.inputContainer(theme)}
        />

        <Input
          value={this.props.telephone}
          placeholder={translate('common.telephone')}
          onChangeText={value => this.updateUI('telephone', value)}
          containerStyle={styles.inputContainer(theme)}
        />
        {this.renderButton()}
        <Text type="heading" style={styles.errorTextStyle(theme)}>
          {this.props.error}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
  }),
  inputContainer: theme => ({
    marginBottom: theme.spacing.large,
  }),
  errorTextStyle: theme => ({
    color: theme.colors.error,
    alignSelf: 'center',
  }),
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
});

const mapStateToProps = ({ account, magento }) => {
  const { customer } = account;
  const { countries } = magento;
  return {
    ...account.ui,
    countries,
    customer,
  };
};

export default connect(mapStateToProps, {
  getCountries,
  updateAccountAddressUI,
  addAccountAddress,
  accountAddressNextLoading,
  resetAccountAddressUI,
})(AddAccountAddress);
