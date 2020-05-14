/**
 * @flow
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import FeaturedProducts from '../home/FeaturedProducts';
import { translate } from '../../i18n';
import { ThemeContext } from '../../theme';
import { NAVIGATION_HOME_PRODUCT_PATH } from '../../navigation/routes';
import { useDispatch } from 'react-redux';
import { setCurrentProduct } from '../../actions';
import { useRelatedProducts } from '../../hooks/useRelatedProducts';

export const RelatedProduct = ({ product, currencySymbol, currencyRate, navigation }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const { relatedProducts } = useRelatedProducts({ product });

  const onProductPress = () => {
    dispatch(setCurrentProduct({ product }));
    navigation.push(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name,
      product: product,
    });
  };

  return (
    <FeaturedProducts
      style={{ marginBottom: theme.spacing.large }}
      products={{ items: relatedProducts }}
      title={translate('product.relatedProductsTitle')}
      titleStyle={styles.relatedProductTitle}
      onPress={onProductPress}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
    />
  );
};

const styles = StyleSheet.create({
  relatedProductTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
