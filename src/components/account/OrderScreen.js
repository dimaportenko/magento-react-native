import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FastImage } from 'react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../common';
import { orderProductDetail } from '../../actions';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';

const OrderScreen = ({
  products,
  navigation,
  currencySymbol,
  orderProductDetail: _orderProductDetail,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    navigation.state.params.item.items.forEach((item) => {
      if (!(item.sku in products)) {
        _orderProductDetail(item.sku);
      }
    });
  }, []);

  const image = (item) => {
    if (products[item.sku]) {
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };

  const renderItem = item => (
    <View style={styles.itemContainer(theme)}>
      <View style={styles.row}>
        <FastImage style={styles.imageStyle(theme)} resizeMode="contain" source={{ uri: image(item.item) }} />
        <View>
          <Text bold>{item.item.name}</Text>
          <Text type="label">{`SKU: ${item.item.sku}`}</Text>
          <Text type="label">
            {`Price: ${currencySymbol} ${item.item.price}`}
          </Text>
          <Text type="label">{`Qty: ${item.item.qty_ordered}`}</Text>
          <Text type="label">{`Subtotal: ${currencySymbol} ${item.item.row_total}`}</Text>
        </View>
      </View>
    </View>
  );

  const { item } = navigation.state.params;

  return (
    <View style={styles.container(theme)}>
      <FlatList
        data={[...item.items]}
        renderItem={renderItem}
        keyExtractor={(_item, index) => index.toString()}
      />
      <Text type="label">{`Status: ${item.status}`}</Text>
      <Text type="label">
        {`Subtotal: ${currencySymbol} ${item.subtotal}`}
      </Text>
      <Text type="label">
        {`Shipping & Handling: ${currencySymbol} ${item.shipping_amount}`}
      </Text>
      <Text type="label" bold>
        {`Grand Total: ${currencySymbol} ${item.total_due}`}
      </Text>
    </View>
  );
};

OrderScreen.navigationOptions = ({ navigation }) => ({
  title: `Order # ${navigation.state.params.item.increment_id}`,
});

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
    flex: 1,
  }),
  itemContainer: theme => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
  }),
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  imageStyle: theme => ({
    width: theme.dimens.orderImageWidth,
    height: theme.dimens.orderImageHeight,
  }),
});

OrderScreen.propTypes = {
  products: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  orderProductDetail: PropTypes.func.isRequired,
};

OrderScreen.defaultProps = {};

const mapStateToProps = ({ account, magento }) => {
  const { products } = account;
  const { default_display_currency_symbol: currencySymbol } = magento.currency;
  return {
    products,
    currencySymbol,
  };
};

export default connect(mapStateToProps, {
  orderProductDetail,
})(OrderScreen);
