import React, { Component } from 'react';
import { Text } from 'react-native';

class ProductListItem extends Component {

	render() {
		return (
				<Text>{this.props.product.name}</Text>
		);
	}
}

export default ProductListItem;
