import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import { Spinner } from '../common';
import {
	checkoutSelectedPaymentChanged,
	checkoutSetActiveSection,
	getGuestCartPaymentMethods,
	checkoutCustomerNextLoading
} from '../../actions';

class CheckoutPaymentMethod extends Component {
	componentWillMount() {
		const { payments, selectedPayment } = this.props;
		if (!selectedPayment && payments.length) {
			this.props.checkoutSelectedPaymentChanged(payments[0]);
		}
	}

	onPaymentSelect(payment) {
		this.props.checkoutSelectedPaymentChanged(payment);
	}

	onNextPressed() {
		const { cartId, selectedPayment } = this.props;
		// const payment = {
		// 	paymentMethod: {
		// 		// po_number: selectedPayment.code,
		// 		method: selectedPayment.code
		// 		// additional_data: [
		// 		// 	"string"
		// 		// ],
		// 		// extension_attributes: {
		// 		// 	agreement_ids: [
		// 		// 		"string"
		// 		// 	]
		// 		// }
		// 	}
		// };
		// this.props.placeGuestCartOrder(cartId, payment);
		this.props.checkoutCustomerNextLoading(true);
		// setTimeout(
		// 	() => {
				// this.props.checkoutCustomerNextLoading(false);
				this.props.getGuestCartPaymentMethods(cartId);
		// 	},
		// 	1000
		// );
		// this.props.checkoutSetActiveSection(4);
	}

	renderPaymentMethods() {
		const { payments } = this.props;

		if (!payments || !payments.length) {
			return <Text>Payment methods not found</Text>;
		}

		const radioProps = payments.map(item => {
			return {
				label: item.title,
				value: item
			};
		});

		return (
				<RadioForm
						style={styles.radioWrap}
						radio_props={radioProps}
						initial={0}
						onPress={value => { this.onPaymentSelect(value); }}
				/>
		);
	}

	renderButton() {
		const { payments } = this.props;
		if (!payments.length) {
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
					{this.renderPaymentMethods()}
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
	const { payments, selectedPayment } = checkout;
	return { cartId, payments, selectedPayment };
};

export default connect(mapStateToProps, {
	checkoutSelectedPaymentChanged,
	checkoutSetActiveSection,
	getGuestCartPaymentMethods,
	checkoutCustomerNextLoading
})(CheckoutPaymentMethod);
