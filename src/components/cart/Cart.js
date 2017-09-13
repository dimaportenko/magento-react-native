import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

class Cart extends Component {
	render() {
		return (
				<Text>Cart Component</Text>
		);
	}
}

const mapStateToProps = (state) => {
	const { cart } = state.cart;
	return { cart };
};

export default connect(mapStateToProps)(Cart);
