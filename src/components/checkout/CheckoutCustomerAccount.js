import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import {
	getCountries,
	checkoutCustomerEmailChanged,
	checkoutCustomerPasswordChanged,
	checkoutCustomerCityChanged,
	checkoutCustomerCountryChanged,
	checkoutCustomerFirstnameChanged,
	checkoutCustomerLastnameChanged,
	checkoutCustomerPostcodeChanged,
	checkoutCustomerRegionChanged,
	checkoutCustomerStreetChanged,
	checkoutCustomerTelephoneChanged,
	checkoutCustomerCountryIdChanged,
	addGuestCartBillingAddress,
	checkoutCreateCustomer
	// loginUser
} from '../../actions';
import { CardSection, Input, Spinner, ModalSelect } from '../common';

import { magento } from '../../magento';
import { magentoOptions } from '../../config/magento';

class CheckoutCustomerAccount extends Component {

	componentWillMount() {
		magento.setOptions(magentoOptions);
		magento.init()
				.then(() => {
					this.props.getCountries();
					// magento.getCountries()
					// 		.then(data => {
					// 			console.log('country');
					// 			console.log(data);
					// 		})
					// 		.catch(error => {
					// 			console.log('error');
					// 			console.log(error);
					// 		});
					// magento.getStoreConfig()
					// 		.then(data => {
					// 			console.log('country');
					// 			console.log(data);
					// 		})
					// 		.catch(error => {
					// 			console.log('error');
					// 			console.log(error);
					// 		});
					// magento.getCountriesByCountryId('US')
					// 		.then(data => {
					// 			console.log('country');
					// 			console.log(data);
					// 		})
					// 		.catch(error => {
					// 			console.log('error');
					// 			console.log(error);
					// 		});
				})
				.catch(error => {
					console.log(error);
				});
	}

	onEmailChange(text) {
		this.props.checkoutCustomerEmailChanged(text);
	}

	onPasswordChange(text) {
		this.props.checkoutCustomerPasswordChanged(text);
	}

	onFirstnameChange(text) {
		this.props.checkoutCustomerFirstnameChanged(text);
	}

	onLastnameChange(text) {
		this.props.checkoutCustomerLastnameChanged(text);
	}

	onRegionChange(text) {
		this.props.checkoutCustomerRegionChanged(text);
	}

	onCountryChange(text) {
		this.props.checkoutCustomerCountryChanged(text);
	}

	onPostcodeChange(text) {
		this.props.checkoutCustomerPostcodeChanged(text);
	}

	onCityChange(text) {
		this.props.checkoutCustomerCityChanged(text);
	}

	onTelephoneChange(text) {
		this.props.checkoutCustomerTelephoneChanged(text);
	}

	onStreetChange(text) {
		this.props.checkoutCustomerStreetChanged(text);
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
			cartId
		} = this.props;

		const customer = {
			customer: {
				email,
				firstname,
				lastname,
				addresses: [{
					defaultShipping: true,
					defaultBilling: true,
					firstname,
					lastname,
					region,
					postcode,
					street: [street],
					city,
					telephone,
					countryId
				}]
			},
			password
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
			useForShipping: true
		};

		// this.props.checkoutCreateCustomer(customer);
		this.props.addGuestCartBillingAddress(cartId, address);
	}

	countrySelect(attributeId, optionValue) {
		this.props.checkoutCustomerCountryIdChanged(optionValue);
	}

	regionSelect(attributeId, selectedRegion) {
		const { countryId, countries } = this.props;
		if (countryId && countryId.length) {
			const country = countries.find(item => {
				return item.id === countryId;
			});
			const regionData = country.available_regions.find(item => {
				return item.code === selectedRegion;
			});
			const region = {
				regionCode: regionData.code,
				region: regionData.name,
				regionId: regionData.id
			};
			this.props.checkoutCustomerRegionChanged(region);
		}
	}

	renderButton() {
		if (this.props.loading) {
			return <Spinner size="large" />;
		}
		return (
				<Button
						onPress={this.onNextPressed.bind(this)}
						title="Next"
				/>
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
						key: value.code
					};
				});

				return (
						<ModalSelect
								disabled={data.length === 0}
								key='regions'
								label='Region'
								attribute='Region'
								value='Region'
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
						onChangeText={this.onRegionChange.bind(this)}
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
							onChangeText={this.onCountryChange.bind(this)}
					/>
			);
		}

		const data = countries.map(value => {
			return {
				label: value.full_name_locale,
				key: value.id
			};
		});

		const country = countries.find(item => {
			return item.id === countryId;
		});
		const label = country ? country.full_name_locale : 'Country';

		return (
				<ModalSelect
						disabled={data.length === 0}
						key='countries'
						label={label}
						attribute='Country'
						value='Country'
						data={data}
						onChange={this.countrySelect.bind(this)}
				/>
		);
	}

	render() {
		return (
				<View>
					<CardSection>
						<Input
								label="Email"
								value={this.props.email}
								placeholder="email@gmail.com"
								onChangeText={this.onEmailChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								secureTextEntry
								label="Password"
								value={this.props.password}
								placeholder="password"
								onChangeText={this.onPasswordChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="Firstname"
								value={this.props.firstname}
								placeholder="firstname"
								onChangeText={this.onFirstnameChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="Lastname"
								value={this.props.lastname}
								placeholder="lastname"
								onChangeText={this.onLastnameChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						{this.renderRegions()}
					</CardSection>

					<CardSection>
						{this.renderCountries()}
					</CardSection>

					<CardSection>
						<Input
								label="Postcode"
								value={this.props.postcode}
								placeholder="postcode"
								onChangeText={this.onPostcodeChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="Street"
								value={this.props.street}
								placeholder="street"
								onChangeText={this.onStreetChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="City"
								value={this.props.city}
								placeholder="city"
								onChangeText={this.onCityChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="Telephone"
								value={this.props.telephone}
								placeholder="telephone"
								onChangeText={this.onTelephoneChange.bind(this)}
						/>
					</CardSection>

					<Text style={styles.errorTextStyle}>
						{this.props.error}
					</Text>

					<CardSection>
						{this.renderButton()}
					</CardSection>
				</View>
		);
	}
}

const styles = {
	errorTextStyle: {
		color: 'red',
		fontSize: 20,
		alignSelf: 'center'
	}
};

const mapStateToProps = ({ checkout, cart }) => {
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
			error,
			loading
	} = checkout.ui;

	const { countries } = checkout;
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
			countries,
			error,
			loading
	};
};

export default connect(
		mapStateToProps, {
			getCountries,
			checkoutCustomerEmailChanged,
			checkoutCustomerPasswordChanged,
			checkoutCustomerCityChanged,
			checkoutCustomerCountryChanged,
			checkoutCustomerFirstnameChanged,
			checkoutCustomerLastnameChanged,
			checkoutCustomerPostcodeChanged,
			checkoutCustomerRegionChanged,
			checkoutCustomerStreetChanged,
			checkoutCustomerTelephoneChanged,
			checkoutCustomerCountryIdChanged,
			addGuestCartBillingAddress,
			checkoutCreateCustomer
			// loginUser
		}
)(CheckoutCustomerAccount);
