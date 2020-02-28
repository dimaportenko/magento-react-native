import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, ScrollView, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getProductMedia,
  addToCartLoading,
  addToCart,
  getConfigurableProductOptions,
  updateProductQtyInput,
  uiProductUpdate,
  uiProductCustomOptionUpdate,
  getCustomOptions,
} from '../../actions';
import { Spinner, ModalSelect, Button, Text, Input, Price } from '../common';
import { getProductCustomAttribute } from '../../helper/product';
import ProductMedia from './ProductMedia';
import { logError } from '../../helper/logger';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { finalPrice } from '../../helper/price';

class Product extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    currencySymbol: PropTypes.string.isRequired,
    currencyRate: PropTypes.number.isRequired,
    uiProductCustomOptionUpdate: PropTypes.func,
    getConfigurableProductOptions: PropTypes.func,
    getCustomOptions: PropTypes.func,
    getProductMedia: PropTypes.func,
    uiProductUpdateOptions: PropTypes.func,
    addToCartLoading: PropTypes.func,
    addToCart: PropTypes.func,
    updateProductQtyInput: PropTypes.func,
  };

  static defaultProps = {
    currencySymbol: '',
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title.toUpperCase(),
    headerBackTitle: ' ',
  });

  state = {
    selectedProduct: null,
  };

  componentDidMount() {
    const { product, medias } = this.props;

    if (product.type_id === 'configurable') {
      this.props.getConfigurableProductOptions(product.sku);
    }

    this.props.getCustomOptions(product.sku);

    if (!medias || !medias[product.sku]) {
      this.props.getProductMedia({ sku: product.sku });
    }
  }

  onPressAddToCart = () => {
    console.log('onPressAddToCart');
    const {
      cart, product, qty, selectedOptions, customer, selectedCustomOptions,
    } = this.props;
    const options = [];
    Object.keys(selectedOptions).forEach((key) => {
      console.log(selectedOptions[key]);
      options.push({
        optionId: key,
        optionValue: selectedOptions[key],
        extensionAttributes: {},
      });
    });

    const customOptions = [];
    selectedCustomOptions && Object.keys(selectedCustomOptions).forEach((key) => {
      console.log(selectedCustomOptions[key]);
      customOptions.push({
        optionId: key,
        optionValue: selectedCustomOptions[key],
        extensionAttributes: {},
      });
    });

    let productOptions = {};
    if (options.length) {
      productOptions = {
        productOption: {
          extensionAttributes: {
            configurableItemOptions: options,
          },
        },
      };
    }

    if (productOptions.productOption && productOptions.productOption.extensionAttributes) {
      productOptions.productOption.extensionAttributes.customOptions = customOptions;
    } else {
      productOptions = {
        productOption: {
          extensionAttributes: {
            customOptions,
          },
        },
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
          ...productOptions,
        },
      },
      customer,
    });
  }

  // TODO: refactor action name
  optionSelect = (attributeId, optionValue) => {
    const { selectedOptions } = this.props;
    const updatedOptions = { ...selectedOptions, [attributeId]: optionValue };
    this.props.uiProductUpdateOptions(updatedOptions);

    this.updateSelectedProduct(updatedOptions);
  }

  customOptionSelect = (optionId, optionValue) => {
    const { selectedCustomOptions } = this.props;
    const updatedCustomOptions = { ...selectedCustomOptions, [optionId]: optionValue };
    this.props.uiProductCustomOptionUpdate(updatedCustomOptions);
  };

  renderDescription() {
    const theme = this.context;
    const { product } = this.props;
    const attribute = getProductCustomAttribute(product, 'description');
    if (attribute) {
      let description = attribute.value.replace(/<\/?[^>]+(>|$)/g, '');
      try {
        description = decodeURI(description);
      } catch (e) {
        logError(e);
      }

      return <Text style={styles.descriptionStyle(theme)}>{description}</Text>;
    }
  }

  renderCustomOptions = () => {
    const theme = this.context;
    const { customOptions } = this.props;
    if (customOptions) {
      return customOptions.map((option) => {
        const data = option.values.map(value => ({
          label: value.title,
          key: value.option_type_id,
        }));

        return (
          <ModalSelect
            style={styles.modalStyle(theme)}
            disabled={data.length === 0}
            key={option.option_id}
            label={option.title}
            attribute={option.option_id}
            value={option.option_id}
            data={data}
            onChange={this.customOptionSelect}
          />
        );
      });
    }
  };

  renderOptions = () => {
    const theme = this.context;
    const {
      options, attributes, product, selectedOptions,
    } = this.props;

    if (Array.isArray(options) && product.children) {
      const prevOptions = [];
      let first = true;
      return options.map((option) => {
        if (!attributes[option.attribute_id]) {
          return <View key={option.id} />;
        }

        let data = option.values.map((value) => {
          let optionLabel = value.value_index;

          if (attributes && attributes[option.attribute_id]) {
            const findedValue = attributes[option.attribute_id].options.find(optionData => Number(optionData.value) === Number(value.value_index));
            if (findedValue) {
              optionLabel = findedValue.label;
            }
          }

          if (first) {
            return {
              label: optionLabel,
              key: value.value_index,
            };
          }

          const match = product.children.find((child) => {
            let found = 0;
            prevOptions.every((prevOption) => {
              const { attributeCode } = attributes[prevOption.attribute_id];
              const currentAttributeCode = attributes[option.attribute_id].attributeCode;
              const childOption = getProductCustomAttribute(child, attributeCode);
              const currentOption = getProductCustomAttribute(child, currentAttributeCode);
              const selectedValue = selectedOptions[prevOption.attribute_id];
              if (Number(childOption.value) === Number(selectedValue)
                && Number(currentOption.value) === Number(value.value_index)) {
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
              key: value.value_index,
            };
          }
          return false;
        });
        data = data.filter(object => object !== false);
        first = false;
        prevOptions.push(option);

        return (
          <ModalSelect
            style={styles.modalStyle(theme)}
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
    const theme = this.context;
    const { cart } = this.props;
    if (cart.addToCartLoading) {
      return <Spinner />;
    }
    return (
      <Button style={styles.buttonStyle(theme)} onPress={this.onPressAddToCart}>
        {translate('product.addToCartButton')}
      </Button>
    );
  }

  updateSelectedProduct = (selectedOptions) => {
    const { product } = this.props;
    const selectedKeys = Object.keys(selectedOptions);

    if (!product.children || !selectedKeys.length) return;

    if (selectedKeys.length === this.props.options?.length) {
      const searchOption = {};
      selectedKeys.forEach((attribute_id) => {
        const code = this.props.attributes[attribute_id].attributeCode;
        searchOption[code] = selectedOptions[attribute_id];
      });

      const selectedProduct = product.children.find((child) => {
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
      return (
        <Price
          style={styles.priceContainer}
          basePrice={selectedProduct.price}
          currencySymbol={this.props.currencySymbol}
          currencyRate={this.props.currencyRate}
        />
      );
    }
    return (
      <Price
        style={styles.priceContainer}
        basePrice={this.props.product.price}
        discountPrice={finalPrice(this.props.product.custom_attributes, this.props.product.price)}
        currencySymbol={this.props.currencySymbol}
        currencyRate={this.props.currencyRate}
      />
    );
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
    const theme = this.context;
    console.log('Product screen render');
    return (
      <ScrollView
        style={styles.container(theme)}
      >
        {this.renderProductMedia()}
        <Text type="heading" bold style={styles.textStyle(theme)}>{this.props.product.name}</Text>
        {this.renderPrice()}
        <Text bold style={styles.textStyle(theme)}>{translate('common.quantity')}</Text>
        <Input
          containerStyle={styles.inputContainer(theme)}
          inputStyle={{ textAlign: 'center' }}
          autoCorrect={false}
          keyboardType="numeric"
          value={`${this.props.qty}`}
          onChangeText={qty => this.props.updateProductQtyInput(qty)}
        />
        {this.renderOptions()}
        {this.renderCustomOptions()}
        {this.renderAddToCartButton()}
        <Text style={styles.errorStyle(theme)}>{this.props.cart.errorMessage}</Text>
        {this.renderDescription()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  textStyle: theme => ({
    padding: theme.spacing.small,
    textAlign: 'center',
  }),
  inputContainer: theme => ({
    width: 40,
    alignSelf: 'center',
    marginBottom: theme.spacing.extraLarge,
  }),
  modalStyle: theme => ({
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
    marginBottom: theme.spacing.large,
  }),
  buttonStyle: theme => ({
    alignSelf: 'center',
    marginTop: 10,
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
  descriptionStyle: theme => ({
    padding: theme.spacing.large,
    lineHeight: 25,
  }),
  errorStyle: theme => ({
    textAlign: 'center',
    padding: theme.spacing.small,
    color: theme.colors.error,
  }),
  priceContainer: {
    alignSelf: 'center',
  },
});

const mapStateToProps = (state) => {
  const { product, options, medias, customOptions } = state.product.current;
  const { attributes, selectedOptions, selectedCustomOptions } = state.product;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = state.magento;
  const { cart, account } = state;
  console.log('Product Component');
  console.log(state.product);
  console.log(cart);
  return {
    cart,
    medias,
    product,
    options,
    attributes,
    currencyRate,
    customOptions,
    currencySymbol,
    selectedOptions,
    selectedCustomOptions,
    customer: account.customer,
    qty: state.product.qtyInput,
  };
};

export default connect(mapStateToProps, {
  getProductMedia,
  addToCartLoading,
  addToCart,
  getConfigurableProductOptions,
  updateProductQtyInput,
  getCustomOptions,
  uiProductCustomOptionUpdate,
  uiProductUpdateOptions: uiProductUpdate,
})(Product);
