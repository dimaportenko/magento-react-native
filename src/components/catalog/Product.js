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
	updateProductQtyInput,
	uiProductUpdate
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
		const { cart, product, qty, selectedOptions } = this.props;
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

	// TODO: refactor action name
	optionSelect(attributeId, optionValue) {
		const { selectedOptions } = this.props;
		// this.props.selectedOptions[attributeId] = optionValue;
		this.props.uiProductUpdateOptions({ ...selectedOptions, [attributeId]: optionValue });
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
		const { options, attributes, product, selectedOptions } = this.props;
		// debugger;
		console.log('Render Options');
		console.log(attributes);
		console.log(options);
		console.log(this.props.product.children);

		if (Array.isArray(options)) {
			const prevOptions = [];
			let first = true;
			return options.map(option => {
					// let disabled = false;
					if (!attributes[option.attribute_id]) {
						return <View key={option.id} />;
					}

					let data = option.values.map(value => {
						let optionLabel = value.value_index;

						if (attributes && attributes[option.attribute_id]) {
							const findedValue = attributes[option.attribute_id].options.find(optionData => {
									return Number(optionData.value) === Number(value.value_index);
							});
							if (findedValue) {
								optionLabel = findedValue.label;
							}
						}

						if (first) {
							// debugger;
							return {
								label: optionLabel,
								key: value.value_index
							};
						}

						const match = product.children.find(child => {
							let found = 0;
							prevOptions.every(prevOption => {
								// debugger;
								const { attributeCode } = attributes[prevOption.attribute_id];
								const currentAttributeCode = attributes[option.attribute_id].attributeCode;
								const childOption = getProductCustomAttribute(child, attributeCode);
								const currentOption = getProductCustomAttribute(child, currentAttributeCode);
								const selectedValue = selectedOptions[prevOption.attribute_id];
								if (Number(childOption.value) === Number(selectedValue) &&
										Number(currentOption.value) === Number(value.value_index)) {
									found++;
									return false;
								}
								return true;
							});
							return found === prevOptions.length;
						});

						if (match) {
							return {
								label: optionLabel,
								key: value.value_index
							};
						}
						return false;
					});
					data = data.filter(object => object !== false);
					first = false;
					prevOptions.push(option);

				return (
						<Options
							disabled={data.length === 0}
							key={option.id}
							label={option.label}
							attribute={option.attribute_id}
							value={option.id}
							data={data}
							onChange={this.optionSelect.bind(this)}
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
		console.log('Product screen render');
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
	const { attributes, selectedOptions } = state.product;
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
		selectedOptions,
		qty: state.product.qtyInput
	};
};

export default connect(mapStateToProps, {
	getProductMedia,
	createGuestCart,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput,
	uiProductUpdateOptions: uiProductUpdate
})(Product);
