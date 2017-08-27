import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image } from 'react-native';

class ProductListItem extends Component {

	image() {
		const { product, magento } = this.props;
		let result = magento.getProductMediaUrl();
		console.log(product);
		product.custom_attributes.map(attribute => {
			if (attribute.attribute_code === 'image') {
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
			textStyle
		} = styles;
		return (
				<View style={containerStyle}>
					<Image style={imageStyle} source={{ uri: this.image() }} />
					<Text style={textStyle}>{this.props.product.name}</Text>
				</View>
		);
	}
}

const styles = {
	containerStyle: {
		flexDirection: 'row',
		flex: 1
	},
	textStyle: {
		flex: 2,
		paddingLeft: 10
	},
	imageStyle: {
		height: 150,
		// width: 150,
		flex: 1,
		marginBottom: 5,
		width: null
	}
};

const mapStateToProps = state => {
	return { magento: state.magento };
};

export default connect(mapStateToProps)(ProductListItem);
