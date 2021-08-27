/**
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
import { Spinner } from '../common';

export const RelatedProducts = ({
  product,
  currencySymbol,
  currencyRate,
  navigation,
}) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { relatedProducts, loading, error } = useRelatedProducts({ product });

  if ((!relatedProducts?.length && !loading) || error) {
    return <View />;
  }

  if (loading) {
    return <Spinner />;
  }

  const onProductPress = pressedProduct => {
    dispatch(setCurrentProduct({ product: pressedProduct }));
    navigation.push(NAVIGATION_HOME_PRODUCT_PATH, {
      title: pressedProduct.name,
      product: pressedProduct,
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
