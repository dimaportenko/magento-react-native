import React, { FC, useContext } from 'react';
import { View, StyleSheet, FlatList, ViewStyle } from 'react-native';
import { Text } from '../common';
import FeaturedProductItem from './FeaturedProductItem';
import { ThemeContext } from '../../theme';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';
import { HomeReducerType } from '../../reducers/HomeReducer';

const FeaturedProducts: FC<{
  style?: ViewStyle;
  title: string;
  products: HomeReducerType['featuredProducts'];
  currencySymbol: string;
  currencyRate: number;
  onPress(product: ProductType): void;
}> = ({ style, title, products, currencySymbol, currencyRate, onPress }) => {
  const theme = useContext(ThemeContext);

  const keyExtractor = (item: ProductType) => item.id.toString();

  return (
    <View style={[container(theme), style]}>
      <Text type="heading" style={styles.title}>
        {title}
      </Text>
      <FlatList
        horizontal
        data={products.items}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <FeaturedProductItem
            product={item}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
            onPress={onPress}
          />
        )}
      />
    </View>
  );
};

const container = (theme: ThemeType) => ({
  height: theme.dimens.WINDOW_HEIGHT * 0.3,
  paddingTop: 10,
});

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default FeaturedProducts;
