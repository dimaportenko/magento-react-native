import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
    getCountries,
    addAccountAddress,
    updateAccountAddressUI,
    accountAddressNextLoading,
    resetAccountAddressUI,
} from '../../actions';
import { CardSection, Input, Spinner, ModalSelect, Button } from '../common';
import Sizes from '../../constants/Sizes';


class AddAccountAddress extends Component {
    componentWillMount() {
        this.props.getCountries();
    }

    componentDidMount() {
        // Hardcode US
        this.props.updateAccountAddressUI('countryId', 'US');
        // Clear the error
        this.props.updateAccountAddressUI('error', false);
        // Clear loading
        this.props.accountAddressNextLoading(false);

        if (this.props.customer && this.props.customer.addresses && this.props.customer.addresses.length) {
            const address = this.props.customer.addresses[0];
            const regionData = address.region;
            const region = {
                regionCode: regionData.region_code,
                region: regionData.region,
                regionId: regionData.region_id,
            };
            this.updateUI('region', region);
            this.updateUI('street', address.street.length ? address.street[0] : '');
            this.updateUI('city', address.city);
            this.updateUI('postcode', address.postcode);
            this.updateUI('telephone', address.telephone);
        }
    }

    onNextPressed = () => {
        const {
            postcode,
            countryId,
            city,
            street,
            region,
            customer,
            telephone,
        } = this.props;

        const data = {
            customer: {
                ...customer,
                addresses: [
                  {
                      region: {
                          region: region.region,
                          region_id: region.regionId,
                          region_code: region.regionCode,
                      },
                      country_id: countryId,
                      street: [street],
                      postcode,
                      city,
                      // same_as_billing: 1,
                      firstname: customer.firstname,
                      lastname: customer.lastname,
                      telephone: telephone,
                  }
                ]
            }
        };

        this.props.accountAddressNextLoading(true);
        this.props.addAccountAddress(customer.id, data);
        this.props.resetAccountAddressUI();
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
    };

    renderButton = () => {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }
        return (
            <View style={styles.nextButtonStyle}>
                <Button
                    onPress={this.onNextPressed}
                    style={styles.buttonStyle}
                >
                    Update
                </Button>
            </View>
        );
    };

    renderRegions = () => {
        const { countryId, countries } = this.props;
        if (countryId && countryId.length && countries.length) {
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
                    onChange={this.regionSelect}
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
    };

    renderCountries = () => {
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
                onChange={this.countrySelect}
            />
        );
    };

    render() {
        return (
            <View style={styles.containerStyle}>
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

                {this.renderButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorTextStyle: {
        color: 'red',
        fontSize: 20,
        alignSelf: 'center',
    },
    nextButtonStyle: {
        flex: 1,
        alignItems: 'center',
    },
    buttonStyle: {
        marginTop: 10,
        alignSelf: 'center',
        width: Sizes.WINDOW_WIDTH * 0.9,
        marginBottom: 10,
    }
});

const mapStateToProps = ({ account }) => {
    const { countries, customer } = account;
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
