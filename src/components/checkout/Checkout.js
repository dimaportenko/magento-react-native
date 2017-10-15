import React, { Component } from 'react';
import { View } from 'react-native';
import CheckoutSection from './CheckoutSection';

class Checkout extends Component {
	static navigationOptions = {
		title: 'Checkout',
		headerBackTitle: ' '
	};

	render() {
		return (
			<View style={styles.container} >
				<CheckoutSection title="Customer Account" number="1" />
				<CheckoutSection title="Shipping Method" number="2" />
				<CheckoutSection title="Payment Method" number="3" />
			</View>
		);
	}
}

const styles = {
	container: {
		backgroundColor: '#fff',
		flex: 1
	}
};

export default Checkout;
