import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged,
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

	render() {
		return (
				<View style={styles.container}>
					{this.renderShippingMethods()}
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
	}
};

const mapStateToProps = ({ cart, checkout }) => {
	const { cartId } = cart;
	const { shipping, selectedShipping } = checkout;
	return { cartId, shipping, selectedShipping };
};

export default connect(mapStateToProps, {
	getGuestCartShippingMethods,
	checkoutSelectedShippingChanged
})(CheckoutShippingMethod);
