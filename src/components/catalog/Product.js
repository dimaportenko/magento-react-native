import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { getProductMedia } from '../../actions';
import { magento } from '../../magento';
import { getProductImageFromAttribute } from '../../helper/product';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	componentWillMount() {
		const { product, media } = this.props;

		if (!media) {
			this.props.getProductMedia({ sku: product.sku });
		}
	}

	renderMedia() {
		const { product, media } = this.props;
		const uri = getProductImageFromAttribute(product);
		return <Image style={styles.imageStyle} resizeMode="contain" source={{ uri }} />;
	}

	render() {
		return (
				<View style={styles.container}>
					{this.renderMedia()}
					<Text>{this.props.product.name}</Text>
					<Text>{this.props.product.price}</Text>
				</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	imageStyle: {
		height: 300,
		top: 0
	}
};

const mapStateToProps = state => {
	const { product, media } = state.product.current;
	console.log('Product Component');
	console.log(product);
	console.log(media);

	return { product, media };
};

export default connect(mapStateToProps, { getProductMedia })(Product);
