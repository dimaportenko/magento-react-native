import React, { Component } from 'react';
import { View, Text, ScrollView, Button, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
	getProductMedia,
	addToCartLoading,
	addToCart,
	getConfigurableProductOptions,
	updateProductQtyInput,
	uiProductUpdate
} from '../../actions';
import { magento } from '../../magento';
import { Spinner, ModalSelect } from '../common';
import HeaderCartButton from '../cart/HeaderCartButton';
import { getProductCustomAttribute } from '../../helper/product';
import { priceSignByCode } from '../../helper/price';
import ProductMedia from './ProductMedia';

class Product extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' ',
		headerRight: <HeaderCartButton />
	});

	componentWillMount() {
		const { product, media } = this.props;

		if (product.type_id === 'configurable') {
			this.props.getConfigurableProductOptions(product.sku);
		}

		if (!media) {
			this.props.getProductMedia({ sku: product.sku });
		}
	}

	onPressAddToCart() {
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
	optionSelect(attributeId, optionValue) {
		const { selectedOptions } = this.props;
		// this.props.selectedOptions[attributeId] = optionValue;
		this.props.uiProductUpdateOptions({ ...selectedOptions, [attributeId]: optionValue });
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
						<ModalSelect
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
			<View style={styles.buttonWrap}>
				<Button
						onPress={this.onPressAddToCart.bind(this)}
						title="Add to Cart"
				/>
			</View>
		);
	}

	render() {
		console.log('Product screen render');
		return (
				<ScrollView style={styles.container}>
					<ProductMedia />
					<Text style={styles.textStyle}>{this.props.product.name}</Text>
					<Text style={styles.textStyle}>
						{priceSignByCode(magento.storeConfig.default_display_currency_code)}
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
	}
});

const mapStateToProps = state => {
	const { product, options } = state.product.current;
	const { attributes, selectedOptions } = state.product;
	const { cart, account } = state;
	console.log('Product Component');
	console.log(state.product);
	console.log(cart);

	return {
		product,
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
