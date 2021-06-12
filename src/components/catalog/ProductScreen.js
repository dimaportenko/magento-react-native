/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HTML from 'react-native-render-html';
import {
  Button,
  HeaderGridToggleIcon,
  Input,
  Price,
  Spinner,
  Text,
} from '../common';
import { translate } from '../../i18n';
import { ThemeContext } from '../../theme';
import {
  getConfigurableProductOptions,
  getCustomOptions,
  updateProductQtyInput,
} from '../../actions';
import { ProductMediaContainer } from './ProductMediaContainer';
import { finalPrice } from '../../helper/price';
import { ProductOptions } from './ProductOptions';
import { ProductCustomOptions } from './ProductCustomOptions';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useProductDescription } from '../../hooks/useProductDescription';
import { RelatedProducts } from './RelatedProducts';
import { ProductReviews } from './reviews/ProductReviews';
import { ReviewFormContainer } from './reviews/ReviewFormContainer';
import { magentoOptions } from '../../config/magento';

export const ProductScreen = props => {
  const { cart, currencyRate, currencySymbol, customer, current } = useSelector(
    state => mapStateToProps(state),
  );
  const dispatch = useDispatch();
  const params = props.navigation?.state?.params
    ? props.navigation?.state?.params
    : {};
  const theme = useContext(ThemeContext);
  const [product] = useState(params.product);
  const [currentProduct, setCurProduct] = useState(current[product.id]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { onPressAddToCart } = useAddToCart({
    product,
    cart,
    customer,
    currentProduct,
  });
  const { description } = useProductDescription({ product });

  useEffect(() => {
    if (product.type_id === 'configurable') {
      dispatch(getConfigurableProductOptions(product.sku, product.id));
    }
    dispatch(
      getCustomOptions(product.sku, product.id),
    ); /*The custom options are available on all product types. */
  }, []); // eslint-disable-line

  useEffect(() => {
    setCurProduct(current[product.id]);
  }, [current, product.id]);

  const renderPrice = () => {
    if (selectedProduct) {
      return (
        <Price
          style={styles.priceContainer}
          basePrice={selectedProduct.price}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
        />
      );
    }
    return (
      <Price
        style={styles.priceContainer}
        basePrice={product.price}
        discountPrice={finalPrice(product.custom_attributes, product.price)}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
      />
    );
  };

  const renderAddToCartButton = () => {
    if (cart.addToCartLoading) {
      return <Spinner />;
    }
    return (
      <Button style={styles.buttonStyle(theme)} onPress={onPressAddToCart}>
        {translate('product.addToCartButton')}
      </Button>
    );
  };

  return (
    <ScrollView style={styles.container(theme)}>
      <ProductMediaContainer
        product={product}
        selectedProductSku={selectedProduct?.sku}
      />
      <Text type="heading" bold style={styles.textStyle(theme)}>
        {product.name}
      </Text>
      {renderPrice()}
      <Text bold style={styles.textStyle(theme)}>
        {translate('common.quantity')}
      </Text>
      <Input
        containerStyle={styles.inputContainer(theme)}
        inputStyle={{ textAlign: 'center' }}
        autoCorrect={false}
        keyboardType="numeric"
        value={`${currentProduct.qtyInput}`}
        onChangeText={qty => dispatch(updateProductQtyInput(qty, product.id))}
      />
      <ProductOptions
        product={product}
        currentProduct={currentProduct}
        setSelectedProduct={setSelectedProduct}
      />
      <ProductCustomOptions product={product} currentProduct={currentProduct} />
      {renderAddToCartButton()}
      <Text style={styles.errorStyle(theme)}>{cart.errorMessage}</Text>
      {description !== '' ? (
        <View style={styles.descriptionStyle}>
          <Text bold type="subheading" style={styles.productDetailTitle}>
            {translate('product.productDetailLabel')}
          </Text>
          <HTML html={description} />
        </View>
      ) : (
        <Text style={styles.descriptionStyle}>
          {translate('product.noProductDetail')}
        </Text>
      )}
      {magentoOptions.reviewEnabled && (
        <>
          <ProductReviews product={product} />
          <ReviewFormContainer product={product} />
        </>
      )}
      <RelatedProducts
        product={product}
        currencyRate={currencyRate}
        currencySymbol={currencySymbol}
        navigation={props.navigation}
      />
    </ScrollView>
  );
};

ProductScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.title.toUpperCase(),
});

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
  buttonStyle: theme => ({
    alignSelf: 'center',
    marginTop: 10,
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
  descriptionStyle: {
    padding: 16,
  },
  productDetailTitle: {
    marginBottom: 4,
  },
  errorStyle: theme => ({
    textAlign: 'center',
    padding: theme.spacing.small,
    color: theme.colors.error,
  }),
  priceContainer: {
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
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
    currencySymbol,
    customer: account.customer,
    current: state.product.current,
  };
};
