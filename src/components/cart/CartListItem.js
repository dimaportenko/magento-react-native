import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { magento } from '../../magento';

class CartListItem extends Component {
	image() {
		// return getProductImageFromAttribute(this.props.product);
	}

	render() {
		const {
			imageStyle,
			containerStyle,
			textStyle,
			infoStyle
		} = styles;
		return (
				<View style={containerStyle}>
					<Image style={imageStyle} resizeMode="contain" source={{ uri: this.image() }} />
					<View style={infoStyle}>
						<Text style={textStyle}>{this.props.item.name}</Text>
						<Text style={textStyle}>
							{magento.storeConfig.default_display_currency_code}
							{' '}
							{this.props.item.price}
						</Text>
						<Text style={textStyle}>Qty: {this.props.item.qty}</Text>
					</View>
				</View>
		);
	}
}

const styles = {
	containerStyle: {
		flexDirection: 'row',
		flex: 1,
		borderColor: '#ddd',
		borderBottomWidth: 1,
		backgroundColor: '#fff',
	},
	infoStyle: {
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 2
	},
	textStyle: {
		flex: 1,
		padding: 10
	},
	imageStyle: {
		height: 100,
		flex: 1,
		margin: 10,
		width: null
	}
};

export default CartListItem;
