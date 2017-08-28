import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image } from 'react-native';

class ProductListItem extends Component {

	getPrice() {
		const { product } = this.props;
		const { price, type_id, sku, children } = product;

		if (price === 0 && type_id === 'configurable') {
			if (children) {
				const newPrice = children.reduce((minPrice, child) => {
					if (!minPrice) {
						return child.price;
					} else if (minPrice > child.price) {
						return child.price;
					}
					return minPrice;
				}, false);
				product.price = newPrice;
				this.props.product = product;
				this.setState({ ...this.state, product });
			}	else {
				this.props.magento.getConfigurableChildren(sku)
						.then(data => {
							product.children = data;
							this.props.product = product;
							this.setState({ ...this.state, product });
						})
						.catch(error => {
							console.log(error);
						});
			}
		}

		return price;
	}

	image() {
		const { product, magento } = this.props;
		let result = magento.getProductMediaUrl();
		console.log(product);
		product.custom_attributes.map(attribute => {
			if (attribute.attribute_code === 'thumbnail') {
				result += attribute.value;
			}
			return attribute.value;
		});
		console.log(result);
		return result;
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
						<Text style={textStyle}>{this.props.product.name}</Text>
						<Text style={textStyle}>
							{this.props.magento.storeConfig.default_display_currency_code}
							{' '}
							{this.getPrice()}
						</Text>
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

const mapStateToProps = state => {
	return { magento: state.magento };
};

export default connect(mapStateToProps)(ProductListItem);
