import React, { FC, useContext } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { ThemeContext } from '../../theme';
import { ThemeType } from '../../theme/theme';

const formatPrice = (price: number, currencyRate: number) =>
  parseFloat((price * currencyRate).toFixed(2));

/**
 * Component to display price of the product. If discount price is
 * available, then base price will be crossed off
 *
 * @param {Object} props                             - props of the component
 * @param {number} [props.basePrice = 0]             - default selling price of the product
 * @param {number} [props.discountPrice = 0]         - special or discount price for the product
 * @param {string} props.currencySymbol              - currency symbol to append before price
 * @param {string} props.currencyRate                - currency rate which must be multiply with the actual price.
 * @param {string} props.style                       - style related to price container
 *
 * @return React component
 */
const Price: FC<{
  currencySymbol: string;
  currencyRate: number;
  basePrice: number;
  discountPrice: number;
  style: ViewStyle;
}> = ({ currencySymbol, currencyRate, basePrice, discountPrice, style }) => {
  const theme = useContext(ThemeContext);
  const isBold = () => {
    return discountPrice ? discountPrice < basePrice : false;
  };
  const renderDiscountPrice = () =>
    discountPrice === basePrice ? null : (
      <Text
        type="label"
        bold={isBold()}
        style={discountPriceText(theme)}>{`${currencySymbol} ${formatPrice(
        discountPrice,
        currencyRate,
      )}`}</Text>
    );

  return (
    <View style={[styles.container, style]}>
      {discountPrice && discountPrice < basePrice
        ? renderDiscountPrice()
        : null}
      <Text
        type="label"
        bold={!isBold()}
        style={basePriceText(
          basePrice,
          discountPrice,
        )}>{`${currencySymbol} ${formatPrice(basePrice, currencyRate)}`}</Text>
    </View>
  );
};

const discountPriceText = (theme: ThemeType) => ({
  marginEnd: theme.spacing.tiny,
});
const basePriceText = (
  basePrice: number,
  discountPrice: number,
): TextStyle => ({
  textDecorationLine:
    discountPrice && discountPrice < basePrice ? 'line-through' : 'none',
});
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export { Price };
