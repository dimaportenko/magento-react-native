import React, { Component } from 'react';
import { Text } from 'react-native';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	render() {
		return (
				<Text>Product screen</Text>
		);
	}
}

export default Product;
