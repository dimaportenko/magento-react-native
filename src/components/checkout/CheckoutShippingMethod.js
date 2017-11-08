import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { getGuestCartShippingMethods } from '../../actions';

class CheckoutShippingMethod extends Component {
	componentWillMount() {
		const { cartId } = this.props;
		this.props.getGuestCartShippingMethods(cartId);
	}

	render() {
		return (
				<Text>CheckoutShippingMethod</Text>
		);
	}
}

const mapStateToProps = ({ cart }) => {
	const { cartId } = cart;
	return { cartId };
};

export default connect(mapStateToProps, { getGuestCartShippingMethods })(CheckoutShippingMethod);
