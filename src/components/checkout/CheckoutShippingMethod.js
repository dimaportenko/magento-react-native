import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import { Spinner } from '../common';
import {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged,
	getGuestCartPaymentMethods
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
		const { cartId } = this.props;
		this.props.getGuestCartPaymentMethods(cartId);
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
			return <Spinner size="large" />;
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
	const { cartId } = cart;
	const { shipping, selectedShipping } = checkout;
	return { cartId, shipping, selectedShipping };
};

export default connect(mapStateToProps, {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged,
	getGuestCartPaymentMethods
})(CheckoutShippingMethod);
