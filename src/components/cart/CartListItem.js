import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { magento } from '../../magento';
import { getProductThumbnailFromAttribute } from '../../helper/product';

class CartListItem extends Component {
	image() {
		const { products, item } = this.props;
		if (products[item.sku]) {
			return getProductThumbnailFromAttribute(products[item.sku]);
		}
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

const mapStateToProps = (state) => {
	const { products } = state.cart;

	console.log('cart products');
	console.log(products);

	return { products };
};

export default connect(mapStateToProps)(CartListItem);
