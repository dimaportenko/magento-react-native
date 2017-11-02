import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CheckoutSection from './CheckoutSection';
import CheckoutCustomerAccount from './CheckoutCustomerAccount';

class Checkout extends Component {
	static navigationOptions = {
		title: 'Checkout',
		headerBackTitle: ' '
	};

	render() {
		return (
			<ScrollView style={styles.container} >
				<CheckoutSection title="Customer Account" number="1" expanded>
					<CheckoutCustomerAccount />
				</CheckoutSection>
				<CheckoutSection title="Shipping Method" number="2" />
				<CheckoutSection title="Payment Method" number="3" />
			</ScrollView>
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
