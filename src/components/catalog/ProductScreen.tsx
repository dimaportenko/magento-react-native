/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext, useState, useEffect, FC } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HTML from 'react-native-render-html';
import { Button, Input, Price, Spinner, Text } from '../common';
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
import { StoreStateType } from '../../reducers';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

export const ProductScreen: FC<{
  navigation: any;
}> = props => {
  const { cart, currencyRate, currencySymbol, customer, current } = useSelector(
    (state: StoreStateType) => mapStateToProps(state),
  );
  const dispatch = useDispatch();
  const params = props.navigation?.state?.params
    ? props.navigation?.state?.params
    : {};
  const theme = useContext(ThemeContext);
  const [product] = useState<ProductType>(params.product);
  const [currentProduct, setCurProduct] = useState(current[product.id]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
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
          style={sh.priceContainer}
          basePrice={selectedProduct.price}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
        />
      );
    }
    return (
      <Price
        style={sh.priceContainer}
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
        <View style={sh.descriptionStyle}>
          <Text bold type="subheading" style={sh.productDetailTitle}>
            {translate('product.productDetailLabel')}
          </Text>
          <HTML html={description} />
        </View>
      ) : (
        <Text style={sh.descriptionStyle}>
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

// @ts-ignore
ProductScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.title.toUpperCase(),
});

const sh = StyleSheet.create({
  descriptionStyle: {
    padding: 16,
  },
  productDetailTitle: {
    marginBottom: 4,
  },
  priceContainer: {
    alignSelf: 'center',
  },
});

const styles = {
  container: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  textStyle: (theme: ThemeType): TextStyle => ({
    padding: theme.spacing.small,
    textAlign: 'center',
  }),
  inputContainer: (theme: ThemeType): ViewStyle => ({
    width: 40,
    alignSelf: 'center',
    marginBottom: theme.spacing.extraLarge,
  }),
  buttonStyle: (theme: ThemeType): ViewStyle => ({
    alignSelf: 'center',
    marginTop: 10,
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
  errorStyle: (theme: ThemeType): TextStyle => ({
    textAlign: 'center',
    padding: theme.spacing.small,
    color: theme.colors.error,
  }),
};

const mapStateToProps = (state: StoreStateType) => {
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
