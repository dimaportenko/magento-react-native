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
	checkoutCustomerTelephoneChanged
	// loginUser
} from '../../actions';
import { CardSection, Input, Spinner } from '../common';

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
		this.props.checkoutCustomerPasswordChanged(text);
	}

	onTelephoneChange(text) {
		this.props.checkoutCustomerTelephoneChanged(text);
	}

	onStreetChange(text) {
		this.props.checkoutCustomerStreetChanged(text);
	}

	onNextPressed() {
		// const { email, password } = this.props;
		// this.props.loginUser({ email, password });
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
						<Input
								label="Region"
								value={this.props.region}
								placeholder="region"
								onChangeText={this.onRegionChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								label="Country"
								value={this.props.country}
								placeholder="country"
								onChangeText={this.onCountryChange.bind(this)}
						/>
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

// "customer": {
// 	"email": "jdoe@example.com",
// 			"firstname": "Jane",
// 			"lastname": "Doe",
// 			"addresses": [{
// 		"defaultShipping": true,
// 		"defaultBilling": true,
// 		"firstname": "Jane",
// 		"lastname": "Doe",
// 		"region": {
// 			"regionCode": "NY",
// 			"region": "New York",
// 			"regionId":43
// 		},
// 		"postcode": "10755",
// 		"street": ["123 Oak Ave"],
// 		"city": "Purchase",
// 		"telephone": "512-555-1111",
// 		"countryId": "US"
// 	}]
// },
// "password": "Password1"

const styles = {
	errorTextStyle: {
		color: 'red',
		fontSize: 20,
		alignSelf: 'center'
	}
};

const mapStateToProps = ({ checkout }) => {
	const {
			email,
			password,
			postcode,
			country,
			firstname,
			lastname,
			telephone,
			city,
			street,
			region,
			error,
			loading
	} = checkout.ui;

	return {
			email,
			password,
			postcode,
			country,
			firstname,
			lastname,
			telephone,
			city,
			street,
			region,
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
			checkoutCustomerTelephoneChanged
			// loginUser
		}
)(CheckoutCustomerAccount);
