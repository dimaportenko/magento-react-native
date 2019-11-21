import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Text } from './Text';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { finalPrice } from '../../helper/price';

const ProductListItem = ({
  product,
  onRowPress,
  currencySymbol,
  imageStyle,
  infoStyle,
  textStyle,
  priceStyle,
  viewContainerStyle,
  columnContainerStyle,
}) => {
  const theme = useContext(ThemeContext);
  const image = () => getProductThumbnailFromAttribute(product);

  return (
    <View style={viewContainerStyle}>
      <TouchableOpacity
        style={[styles.containerStyle(theme), columnContainerStyle]}
        onPress={() => { onRowPress(product); }}
      >

        <FastImage
          style={[styles.imageStyle(theme), imageStyle]}
          resizeMode="contain"
          source={{ uri: image() }}
        />
        <View style={[styles.infoStyle, infoStyle]}>
          <Text type="subheading" style={[styles.textStyle(theme), textStyle]}>{product.name}</Text>
          <Text type="heading" style={[styles.priceStyle(theme), priceStyle]}>
            {`${currencySymbol} ${finalPrice(product.custom_attributes, product.price)}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    sku: PropTypes.string.isRequired,
    type_id: PropTypes.string,
    price: PropTypes.number,
    custom_attributes: PropTypes.arrayOf(PropTypes.shape({
      attribute_code: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    })),
  }).isRequired,
  onRowPress: PropTypes.func,
  imageStyle: PropTypes.object,
  infoStyle: PropTypes.object,
  textStyle: PropTypes.object,
  priceStyle: PropTypes.object,
  viewContainerStyle: PropTypes.object,
  columnContainerStyle: PropTypes.object,
  currencySymbol: PropTypes.string.isRequired,
};

ProductListItem.defaultProps = {
  onRowPress: () => {},
  imageStyle: {},
  infoStyle: {},
  textStyle: {},
  priceStyle: {},
  viewContainerStyle: {},
  columnContainerStyle: {},
};

const styles = {
  containerStyle: theme => ({
    flexDirection: 'row',
    flex: 1,
    backgroundColor: theme.colors.surface,
  }),
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 2,
  },
  textStyle: theme => ({
    flex: 1,
    padding: theme.spacing.small,
    marginTop: theme.spacing.large,
  }),
  priceStyle: theme => ({
    flex: 1,
    padding: theme.spacing.small,
    paddingTop: 0,
  }),
  imageStyle: theme => ({
    height: theme.dimens.productListItemImageHeight,
    margin: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: null,
  }),
};

export { ProductListItem };
