import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import { Spinner } from '../common';
import {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged,
	addGuestCartShippingInfo,
	checkoutCustomerNextLoading
} from '../../actions';

class CheckoutShippingMethod extends Component {
	componentWillMount() {
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

	onNextPressed() {
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
			selectedShipping
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
			}
		};

		this.props.checkoutCustomerNextLoading(true);
		this.props.addGuestCartShippingInfo(cartId, address);
	}

	renderShippingMethods() {
		const { shipping } = this.props;

		if (!shipping || !shipping.length) {
			return <Text>Shipping methods not found for selected address</Text>;
		}

		const radioProps = shipping.map(item => {
			const label = `${item.carrier_title} - ${item.method_title} - ${item.amount}`;
			return {
				label,
				value: item
			};
		});

		return (
				<RadioForm
						style={styles.radioWrap}
						radio_props={radioProps}
						initial={0}
						onPress={value => { this.onShippingSelect(value); }}
				/>
		);
	}

	renderButton() {
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
					<Button
							onPress={this.onNextPressed.bind(this)}
							title="Next"
					/>
				</View>
		);
	}

	render() {
		return (
				<View style={styles.container}>
					{this.renderShippingMethods()}
					{this.renderButton()}
				</View>
		);
	}
}

const styles = {
	container: {
		margin: 15,
		alignItems: 'flex-start',
	},
	radioWrap: {
		alignItems: 'flex-start',
		alignSelf: 'flex-start'
	},
	nextButtonStyle: {
		flex: 1,
		alignSelf: 'center'
	}
};

const mapStateToProps = ({ cart, checkout }) => {
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
		loading
	} = checkout.ui;

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
		selectedShipping
	};
};

export default connect(mapStateToProps, {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged,
	addGuestCartShippingInfo,
	checkoutCustomerNextLoading
})(CheckoutShippingMethod);
