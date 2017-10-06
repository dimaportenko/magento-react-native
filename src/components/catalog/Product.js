import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Button, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import {
	getProductMedia,
	createGuestCart,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput
} from '../../actions';
import { magento } from '../../magento';
import { Spinner } from '../common';
import HeaderCartButton from '../cart/HeaderCartButton';
import Options from './Options';
import { getProductCustomAttribute } from '../../helper/product';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' ',
		headerRight: <HeaderCartButton />
	});

	componentWillMount() {
		const { product, media } = this.props;

		this.props.getConfigurableProductOptions(product.sku);

		if (!media) {
			this.props.getProductMedia({ sku: product.sku });
		}
	}

	componentDidMount() {
	}

	onPressAddToCart() {
		console.log('onPressAddToCart');
		const { cart, product, qty } = this.props;
		const options = [];
		Object.keys(selectedOptions).forEach(key => {
			console.log(selectedOptions[key]);
			options.push({
				optionId: key,
				optionValue: selectedOptions[key],
				extensionAttributes: {}
			});
		});

		let productOptions = {};
		if (options.length) {
			productOptions = {
				productOption: {
					extensionAttributes: {
						configurableItemOptions: options
					}
				}
			};
		}

		this.props.addToCartLoading(true);
		this.props.addToCart({
			cartId: cart.cartId,
			item: {
				cartItem: {
					sku: product.sku,
					qty,
					quoteId: cart.cartId,
					...productOptions
				}
			}
		});
	}

	optionSelect(attributeId, optionValue) {
		selectedOptions[attributeId] = optionValue;
	}

	renderMedia() {
		const { media } = this.props;

		if (!media) {
			return <Spinner />;
		}
		return (
				<Swiper
						showsPagination
						pagingEnabled
						autoplay={false}
				>
					{this.renderMediaItems()}
				</Swiper>
		);
	}

	renderMediaItems() {
		const { media } = this.props;

		return media.map(item => {
			return (
				<Image
						key={item.id}
						style={styles.imageStyle}
						resizeMode="contain"
						source={{ uri: magento.getProductMediaUrl() + item.file }}
				/>
			);
		});
	}

	renderDescription() {
		const { product } = this.props;
		const attribute = getProductCustomAttribute(product, 'short_description');

		if (attribute) {
			return (
					<Text style={styles.descriptionStyle}>{attribute.value}</Text>
			);
		}
	}

	renderOptions() {
		const { options, attributes } = this.props;
		// debugger;
		if (Array.isArray(options)) {
			return options.map(option => {
					const data = option.values.map(value => {
						let optionLabel = value.value_index;

						if (attributes && attributes[option.attribute_id]) {
							const findedValue = attributes[option.attribute_id].find(optionData => {
									return Number(optionData.value) === Number(value.value_index);
							});
							if (findedValue) {
								optionLabel = findedValue.label;
							}
						}

						return {
							label: optionLabel,
							key: value.value_index
						};
					});

					return (
						<Options
							key={option.id}
							label={option.label}
							attribute={option.attribute_id}
							value={option.id}
							data={data}
							onChange={this.optionSelect}
						/>
					);
			});
		}
	}

	renderAddToCartButton() {
		const { cart } = this.props;
		if (cart.addToCartLoading) {
			return <Spinner />;
		}
		return (
				<Button
						onPress={this.onPressAddToCart.bind(this)}
						title="Add to Cart"
				/>
		);
	}

	render() {
		return (
				<ScrollView style={styles.container}>
					<View style={styles.imageContainer}>
						{this.renderMedia()}
					</View>
					<Text style={styles.textStyle}>{this.props.product.name}</Text>
					<Text style={styles.textStyle}>
						{magento.storeConfig.default_display_currency_code}
						{' '}
						{this.props.product.price}
					</Text>
					{this.renderDescription()}
					<Text style={styles.textStyle}>Qty</Text>
					<TextInput
							autoCorrect={false}
							style={styles.textStyle}
							keyboardType='numeric'
							value={`${this.props.qty}`}
							onChangeText={qty => this.props.updateProductQtyInput(qty)}
					/>
					{this.renderOptions()}
					{this.renderAddToCartButton()}
					<Text style={styles.errorStyle}>{this.props.cart.errorMessage}</Text>
				</ScrollView>
		);
	}
}

const selectedOptions = {};

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	imageContainer: {
		height: 300,
	},
	imageStyle: {
		height: 290,
		top: 0
	},
	textStyle: {
		padding: 10,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	descriptionStyle: {
		padding: 10,
	},
	errorStyle: {
		textAlign: 'center',
		padding: 10,
		color: 'red'
	},
	dropDownContainer: {
		flex: 1,
		backgroundColor: '#333'
	}
};

const mapStateToProps = state => {
	const { product, media, options } = state.product.current;
	const { attributes } = state.product;
	const { cart } = state;
	console.log('Product Component');
	console.log(state.product);
	console.log(cart);

	return {
		product,
		media,
		cart,
		options,
		attributes,
		qty: state.product.qtyInput
	};
};

export default connect(mapStateToProps, {
	getProductMedia,
	createGuestCart,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput
})(Product);
