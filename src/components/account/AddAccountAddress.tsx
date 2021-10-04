import React, { Component } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
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
import { ThemeType } from '../../theme/theme';
import { StoreStateType } from '../../reducers';
import { AddressType, CustomerType } from '../../magento/types';
import { AddressDataType, CustomerDataType } from "../../magento/lib/types";

const mapStateToProps = ({ account, magento }: StoreStateType) => {
  const { customer } = account;
  const { countries } = magento;
  return {
    ...account.ui,
    countries,
    customer,
  };
};

const connector = connect(mapStateToProps, {
  getCountries,
  updateAccountAddressUI,
  addAccountAddress,
  accountAddressNextLoading,
  resetAccountAddressUI,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

type State = {};

class AddAccountAddress extends Component<PropsFromRedux, State> {
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

    if (!customer) return;

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

    const address: AddressDataType = {
      region: regionValue,
      country_id: countryId,
      street: [street],
      postcode,
      city,
      // same_as_billing: 1,
      telephone,
    };
    if (customer?.firstname) {
      address.firstname = customer.firstname;
    }
    if (customer?.lastname) {
      address.lastname = customer.lastname;
    }

    const data: CustomerDataType = {
      customer: {
        ...customer,
        addresses: [address],
      },
    };

    this.props.updateAccountAddressUI('error', false);
    this.props.accountAddressNextLoading(true);
    this.props.addAccountAddress(customer.id, data);
    // this.props.resetAccountAddressUI();
  };

  updateUI = (key: string, value: unknown) => {
    this.props.updateAccountAddressUI(key, value);
  };

  countrySelect = (attributeId: string, optionValue: string) => {
    this.props.updateAccountAddressUI('countryId', optionValue);
  };

  regionSelect = (attributeId: string, selectedRegion: string) => {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length) {
      const country = countries?.find(item => item.id === countryId);
      const regionData = country?.available_regions.find(
        item => item.id === selectedRegion,
      );
      const region = {
        regionCode: regionData?.code,
        region: regionData?.name,
        regionId: regionData?.id,
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
    const { countryId, countries, region } = this.props;
    if (countryId && countryId.length && countries && countries.length) {
      const country = countries.find(item => item.id === countryId);
      if (country && country.available_regions) {
        const data = country.available_regions.map(value => ({
          label: value.name,
          key: value.id,
        }));

        const label =
          typeof region === 'object' && region?.region
            ? region.region
            : translate('common.region');

        return (
          <ModalSelect
            withLabel={false}
            disabled={data.length === 0}
            key="regions"
            label={label ?? ''}
            attribute="Region"
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
        withLabel={false}
        disabled={data.length === 0}
        key="countries"
        label={label ?? ''}
        attribute={translate('common.country') ?? ''}
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

const styles = {
  container: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
  }),
  inputContainer: (theme: ThemeType) => ({
    marginBottom: theme.spacing.large,
  }),
  errorTextStyle: (theme: ThemeType): TextStyle => ({
    color: theme.colors.error,
    alignSelf: 'center',
  }),
  buttonStyle: (theme: ThemeType): ViewStyle => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
};

export default connector(AddAccountAddress);
