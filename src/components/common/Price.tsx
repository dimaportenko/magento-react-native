import React, { useContext } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './Text';
import { ThemeContext } from '../../theme';

const formatPrice = (price, currencyRate) =>
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
const Price = ({
  currencySymbol,
  currencyRate,
  basePrice,
  discountPrice,
  style,
}) => {
  const theme = useContext(ThemeContext);
  const isBold = () => discountPrice && discountPrice < basePrice;
  const renderDiscountPrice = () =>
    discountPrice === basePrice ? null : (
      <Text
        type="label"
        bold={isBold()}
        style={styles.discountPriceText(
          theme,
        )}>{`${currencySymbol} ${formatPrice(
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
        style={styles.basePriceText(
          basePrice,
          discountPrice,
        )}>{`${currencySymbol} ${formatPrice(basePrice, currencyRate)}`}</Text>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
  },
  discountPriceText: theme => ({
    marginEnd: theme.spacing.tiny,
  }),
  basePriceText: (basePrice, discountPrice) => ({
    textDecorationLine:
      discountPrice && discountPrice < basePrice ? 'line-through' : 'none',
  }),
};

Price.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  currencyRate: PropTypes.number.isRequired,
  basePrice: PropTypes.number,
  discountPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: ViewPropTypes.style,
};

Price.defaultProps = {
  basePrice: 0,
  discountPrice: 0,
  style: {},
};

export { Price };
