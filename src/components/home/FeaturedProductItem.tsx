import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { Text, Price } from '../common';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { finalPrice } from '../../helper/price';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const FeaturedProductItem: FC<{
  onPress(item: ProductType): void;
  currencySymbol: string;
  currencyRate: number;
  product: ProductType;
}> = ({ onPress, currencySymbol, currencyRate, product }) => {
  const theme = useContext(ThemeContext);
  const [themeStyles, setThemeStyle] = useState<{
    image: StyleProp<ImageStyle>;
    text: StyleProp<TextStyle>;
  }>();
  const [imageURI, setImageURI] = useState('');
  const price = useMemo(
    () => finalPrice(product.custom_attributes, product.price),
    [product.custom_attributes, product.price],
  );
  useEffect(
    () => setImageURI(getProductThumbnailFromAttribute(product)),
    [product],
  );
  useEffect(
    () =>
      setThemeStyle({
        image: imageStyle(theme),
        text: textStyle(theme),
      }),
    [theme],
  );

  return (
    <View style={container(theme)}>
      <TouchableOpacity
        style={containerStyle(theme)}
        onPress={() => {
          onPress(product);
        }}>
        <FastImage
          style={themeStyles?.image}
          resizeMode="contain"
          source={{ uri: imageURI }}
        />
        <View style={styles.infoStyle}>
          <Text
            type="subheading"
            style={themeStyles?.text}
            ellipsizeMode="tail"
            numberOfLines={2}>
            {product.name}
          </Text>
          <Price
            basePrice={product.price}
            discountPrice={price}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const container = (theme: ThemeType) => ({
  padding: theme.spacing.tiny,
  width: theme.dimens.WINDOW_WIDTH * 0.32,
});
const containerStyle = (theme: ThemeType): StyleProp<ViewStyle> => ({
  flexDirection: 'column',
  flex: 1,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.surface,
  borderRadius: theme.dimens.borderRadius,
  alignItems: 'center',
  justifyContent: 'center',
});
const textStyle = (theme: ThemeType): StyleProp<TextStyle> => ({
  justifyContent: 'center',
  textAlign: 'center',
  flexDirection: 'column',
  marginTop: theme.spacing.small,
});
const imageStyle = (theme: ThemeType) => ({
  height: theme.dimens.homeProductImageHeight,
  width: theme.dimens.homeProductImageWidth,
});

const styles = StyleSheet.create({
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceStyle: {
    textAlign: 'center',
  },
});

export default FeaturedProductItem;
