import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
	getProductMedia,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput,
	uiProductUpdate
} from '../../actions';
import { magento } from '../../magento';
import { Spinner, ModalSelect, Button } from '../common';
import { getProductCustomAttribute } from '../../helper/product';
import { priceSignByCode } from '../../helper/price';
import ProductMedia from './ProductMedia';
import Sizes from '../../constants/Sizes';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' ',
	});

	state = {
		selectedProduct: null
	}

	componentDidMount() {
		const { product, medias } = this.props;

		if (product.type_id === 'configurable') {
			this.props.getConfigurableProductOptions(product.sku);
		}

		if (!medias || !medias[product.sku]) {
			this.props.getProductMedia({ sku: product.sku });
		}
	}

	onPressAddToCart = () => {
		console.log('onPressAddToCart');
		const { cart, product, qty, selectedOptions, customer } = this.props;
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
			},
			customer
		});
	}

	// TODO: refactor action name
	optionSelect = (attributeId, optionValue) => {
		const { selectedOptions } = this.props;
		const updatedOptions = { ...selectedOptions, [attributeId]: optionValue };
		this.props.uiProductUpdateOptions(updatedOptions);

		this.updateSelectedProduct(updatedOptions);
	}

  renderDescription() {
    const { product } = this.props;
    const attribute = getProductCustomAttribute(product, 'description');
    if (attribute) {
			let description = attribute.value.replace(/<\/?[^>]+(>|$)/g, '');
			try {
				description = decodeURI(description);
			} catch (e) {
				// console.log(e);
			}

      return <Text style={styles.descriptionStyle}>{description}</Text>;
    }
  }

	renderOptions() {
		const { options, attributes, product, selectedOptions } = this.props;

		if (Array.isArray(options)) {
			const prevOptions = [];
			let first = true;
			return options.map(option => {
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
							return {
								label: optionLabel,
								key: value.value_index
							};
						}

						const match = product.children.find(child => {
							let found = 0;
							prevOptions.every(prevOption => {
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
						<ModalSelect
							disabled={data.length === 0}
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
			<View style={styles.buttonWrap}>
				<Button style={styles.buttonStyle} onPress={this.onPressAddToCart}>
          Add to Cart
        </Button>
			</View>
		);
	}

	updateSelectedProduct = (selectedOptions) => {
		const { product } = this.props;
		const selectedKeys = Object.keys(selectedOptions);

		if (!product.children || !selectedKeys.length) return;

		if (selectedKeys.length === this.props.options.length) {
			const searchOption = {};
			selectedKeys.forEach(attribute_id => {
				const code = this.props.attributes[attribute_id].attributeCode;
				searchOption[code] = selectedOptions[attribute_id];
			});

			const selectedProduct = product.children.find(child => {
				const found = _.every(searchOption, (value, code) => {
					const childOption = getProductCustomAttribute(child, code);
					return Number(childOption.value) === Number(value);
				});
				return found;
			});

			if (selectedProduct) {
				const { medias } = this.props;
				this.setState({ selectedProduct });
				if (!medias || !medias[selectedProduct.sku]) {
					this.props.getProductMedia({ sku: selectedProduct.sku });
				}
			}
		}
	}

	renderPrice = () => {
		const { selectedProduct } = this.state;
		if (selectedProduct) {
			return selectedProduct.price;
		}
		return this.props.product.price;
	}

	renderProductMedia = () => {
		const { medias, product } = this.props;
		const { selectedProduct } = this.state;
		if (!medias) {
			return (
				<ProductMedia media={null} />
			);
		}
		if (selectedProduct && medias[selectedProduct.sku]) {
			return (
				<ProductMedia media={medias[selectedProduct.sku]} />
			);
		}
		return (
			<ProductMedia media={medias[product.sku]} />

		);
	}

	render() {
		console.log('Product screen render');
		return (
				<ScrollView style={styles.container}>
					{this.renderProductMedia()}
					<Text style={styles.textStyle}>{this.props.product.name}</Text>
					<Text style={styles.textStyle}>
						{priceSignByCode(magento.storeConfig.default_display_currency_code)}
						{this.renderPrice()}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	textStyle: {
		padding: 10,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	descriptionStyle: {
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		fontWeight: '300',
		lineHeight: 25
	},
	errorStyle: {
		textAlign: 'center',
		padding: 10,
		color: 'red'
	},
	dropDownContainer: {
		flex: 1,
		backgroundColor: '#333'
	},
	buttonWrap: {
		alignItems: 'center'
	},
  buttonStyle: {
	  marginTop: 10,
    width: Sizes.WINDOW_WIDTH * 0.9
  }
});

const mapStateToProps = state => {
	const { product, options, medias } = state.product.current;
	const { attributes, selectedOptions } = state.product;
	const { cart, account } = state;
	console.log('Product Component');
	console.log(state.product);
	console.log(cart);
	return {
		product,
		medias,
		cart,
		options,
		attributes,
		selectedOptions,
		customer: account.customer,
		qty: state.product.qtyInput
	};
};

export default connect(mapStateToProps, {
	getProductMedia,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput,
	uiProductUpdateOptions: uiProductUpdate
})(Product);
