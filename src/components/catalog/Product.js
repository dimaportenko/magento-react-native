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
  setCurrentProduct,
  getRelatedProduct,
} from '../../actions';
import { Spinner, ModalSelect, Button, Text, Input, Price } from '../common';
import { getProductCustomAttribute, getProductCustomAttributeValue, } from '../../helper/product';
import ProductMedia from './ProductMedia';
import { logError } from '../../helper/logger';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { finalPrice } from '../../helper/price';
import {
  NAVIGATION_HOME_PRODUCT_PATH,
} from '../../navigation/routes';
import FeaturedProducts from '../home/FeaturedProducts';

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
    setCurrentProduct: PropTypes.func,
    getRelatedProduct: PropTypes.func,
    updateProductQtyInput: PropTypes.func,
    relatedProducts: PropTypes.arrayOf(PropTypes.object),
    relatedProductsLoading: PropTypes.bool,
    relatedProductsError: PropTypes.string,
    current: PropTypes.object,
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
    showRelatedProduct: true,
  };

  constructor(props) {
    super(props);

    const { navigation } = props;
    const params = navigation && navigation.state.params ? navigation.state.params : {};
    const { product } = params;
    this.state.product = product;
  }

  componentDidMount() {
    const { product } = this.state;
    const { medias } = this.props.current[product.id] ? this.props.current[product.id] : {};

    if (product.type_id === 'configurable') {
      this.props.getConfigurableProductOptions(product.sku, product.id);
      this.props.getCustomOptions(product.sku, product.id);
    }


    if (!medias || !medias[product.sku]) {
      this.props.getProductMedia({ sku: product.sku, id: product.id });
    }

    const categoryIds = getProductCustomAttributeValue(product, 'category_ids');
    if (categoryIds && categoryIds.length) {
      this.props.getRelatedProduct(categoryIds, product.sku);
    } else {
      // No category id present in custom_attributes
      this.setState({ showRelatedProduct: false });
    }
  }

  componentDidUpdate(props) {
    if (
      props.current
      && props.current[this.state.product.id]
      && props.current[this.state.product.id].product
      && props.current[this.state.product.id].product.price !== this.state.product.price
    ) {
      this.setState({
        product: props.current[this.state.product.id].product,
      });
    }
  }

  onPressAddToCart = () => {
    console.log('onPressAddToCart');
    const { product } = this.state;
    const { cart, customer } = this.props;
    const {
      qtyInput: qty, selectedOptions, selectedCustomOptions,
    } = this.props.current[product.id];
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
    const { product } = this.state;
    const { selectedOptions } = this.props.current[product.id];
    const updatedOptions = { ...selectedOptions, [attributeId]: optionValue };
    this.props.uiProductUpdateOptions(updatedOptions, product.id);

    this.updateSelectedProduct(updatedOptions);
  }

  customOptionSelect = (optionId, optionValue) => {
    const { product } = this.state;
    const { selectedCustomOptions } = this.props.current[product.id];
    const updatedCustomOptions = { ...selectedCustomOptions, [optionId]: optionValue };
    this.props.uiProductCustomOptionUpdate(updatedCustomOptions, product.id);
  };

  renderDescription() {
    const theme = this.context;
    const { product } = this.state;
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

  onProductPress(product) {
    this.props.setCurrentProduct({ product });
    this.props.navigation.push(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name,
      product: product,
    });
  }

  renderRelatedProduct() {
    const theme = this.context;
    const products = this.props.relatedProducts || [];
    return (
      <FeaturedProducts
        style={{ marginBottom: theme.spacing.large }}
        products={{ items: products }}
        title={translate('product.relatedProductsTitle')}
        titleStyle={styles.relatedProductTitle}
        onPress={this.onProductPress.bind(this)}
        currencySymbol={this.props.currencySymbol}
        currencyRate={this.props.currencyRate}
      />
    );
  }

  renderCustomOptions = () => {
    const theme = this.context;
    const { product } = this.state;
    const { customOptions } = this.props.current[product.id];
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
    const { product } = this.state;
    const {
      options, attributes, selectedOptions,
    } = this.props.current[product.id];

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
    const { product } = this.state;
    const { attributes, options } = this.props.current[product.id];
    const selectedKeys = Object.keys(selectedOptions);

    if (!product.children || !selectedKeys.length) return;

    if (selectedKeys.length === options.length) {
      const searchOption = {};
      selectedKeys.forEach((attribute_id) => {
        const code = attributes[attribute_id].attributeCode;
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
        const { medias } = this.props.current[this.state.product.id];
        this.setState({ selectedProduct });
        if (!medias || !medias[selectedProduct.sku]) {
          this.props.getProductMedia({ sku: selectedProduct.sku, id: product.id });
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
        basePrice={this.state.product.price}
        discountPrice={finalPrice(this.state.product.custom_attributes, this.state.product.price)}
        currencySymbol={this.props.currencySymbol}
        currencyRate={this.props.currencyRate}
      />
    );
  }

  renderProductMedia = () => {
    const { selectedProduct, product } = this.state;
    const { medias } = this.props.current[product.id];
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
    const { showRelatedProduct, product } = this.state;
    const { relatedProductsError } = this.props;
    const current = this.props.current[product.id];
    console.log('Product screen render');
    return (
      <ScrollView
        style={styles.container(theme)}
      >
        {this.renderProductMedia()}
        <Text type="heading" bold style={styles.textStyle(theme)}>{product.name}</Text>
        {this.renderPrice()}
        <Text bold style={styles.textStyle(theme)}>{translate('common.quantity')}</Text>
        <Input
          containerStyle={styles.inputContainer(theme)}
          inputStyle={{ textAlign: 'center' }}
          autoCorrect={false}
          keyboardType="numeric"
          value={`${current.qtyInput}`}
          onChangeText={qty => this.props.updateProductQtyInput(qty, product.id)}
        />
        {this.renderOptions()}
        {this.renderCustomOptions()}
        {this.renderAddToCartButton()}
        <Text style={styles.errorStyle(theme)}>{this.props.cart.errorMessage}</Text>
        {this.renderDescription()}
        {showRelatedProduct && !relatedProductsError && this.renderRelatedProduct()}
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
  relatedProductTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  const {
    relatedProducts: {
      items: relatedProducts,
      loading: relatedProductsLoading,
      error: relatedProductsError,
    }
  } = state.product;

  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = state.magento;

  const { cart, account } = state;

  return {
    cart,
    currencyRate,
    relatedProducts,
    relatedProductsLoading,
    relatedProductsError,
    currencySymbol,
    customer: account.customer,
    current: state.product.current,
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
  setCurrentProduct,
  getRelatedProduct,
  uiProductUpdateOptions: uiProductUpdate,
})(Product);
