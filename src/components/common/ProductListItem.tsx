import React, { FC, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { Text } from './Text';
import { Price } from './Price';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { finalPrice } from '../../helper/price';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const ProductListItem: FC<{
  product: ProductType;
  onRowPress(item: ProductType): void;
  currencySymbol: string;
  currencyRate: number;
  imageStyle?: StyleProp<ImageStyle>;
  infoStyle?: ViewStyle;
  textStyle?: TextStyle;
  viewContainerStyle?: ViewStyle;
  columnContainerStyle?: ViewStyle;
}> = ({
  product,
  onRowPress,
  currencySymbol,
  currencyRate,
  imageStyle,
  infoStyle,
  textStyle,
  viewContainerStyle,
  columnContainerStyle,
}) => {
  const theme = useContext(ThemeContext);
  const image = () => getProductThumbnailFromAttribute(product);

  return (
    <View style={viewContainerStyle}>
      <TouchableOpacity
        style={[styles.containerStyle(theme), columnContainerStyle]}
        onPress={() => {
          onRowPress(product);
        }}>
        <FastImage
          style={[styles.imageStyle(theme), imageStyle]}
          resizeMode="contain"
          source={{ uri: image() }}
        />
        <View style={[sh.infoStyle, infoStyle]}>
          <Text type="subheading" style={[styles.textStyle(theme), textStyle]}>
            {product.name}
          </Text>
          <Price
            style={styles.textStyle(theme)}
            basePrice={product.price}
            discountPrice={finalPrice(product.custom_attributes, product.price)}
            currencyRate={currencyRate}
            currencySymbol={currencySymbol}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const sh = StyleSheet.create({
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 2,
  },
});

const styles = {
  containerStyle: (theme: ThemeType): ViewStyle => ({
    flexDirection: 'row',
    flex: 1,
    backgroundColor: theme.colors.surface,
  }),
  textStyle: (theme: ThemeType) => ({
    padding: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  }),
  imageStyle: (theme: ThemeType): StyleProp<ImageStyle> => ({
    height: theme.dimens.productListItemImageHeight,
    margin: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: undefined,
  }),
};

export { ProductListItem };
