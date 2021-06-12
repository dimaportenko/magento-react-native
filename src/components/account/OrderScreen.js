import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Price } from '../common';
import { orderProductDetail } from '../../actions';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';

const OrderScreen = ({
  products,
  navigation,
  orderProductDetail: _orderProductDetail,
}) => {
  const theme = useContext(ThemeContext);
  const currencySymbol = priceSignByCode(
    navigation.state.params.item.order_currency_code,
  );

  useEffect(() => {
    navigation.state.params.item.items.forEach(item => {
      if (!(item.sku in products)) {
        _orderProductDetail(item.sku);
      }
    });
  }, [_orderProductDetail, navigation.state.params.item.items, products]);

  const image = item => {
    if (products[item.sku]) {
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };

  const renderItem = item => (
    <View style={styles.itemContainer(theme)}>
      <View style={styles.row}>
        <FastImage
          style={styles.imageStyle(theme)}
          resizeMode="contain"
          source={{ uri: image(item.item) }}
        />
        <View>
          <Text bold>{item.item.name}</Text>
          <Text type="label">{`${translate('common.sku')}: ${
            item.item.sku
          }`}</Text>
          <View style={styles.row}>
            <Text type="label">{`${translate('common.price')}: `}</Text>
            <Price
              currencyRate={1}
              currencySymbol={currencySymbol}
              basePrice={item.item.price}
            />
          </View>
          <Text type="label">{`${translate('common.quantity')}: ${
            item.item.qty_ordered
          }`}</Text>
          <View style={styles.row}>
            <Text type="label">{`${translate('common.subTotal')}: `}</Text>
            <Price
              basePrice={item.item.row_total}
              currencyRate={1}
              currencySymbol={currencySymbol}
            />
          </View>
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
      <Text type="label">{`${translate('orderListItem.status')}: ${
        item.status
      }`}</Text>
      <View style={styles.row}>
        <Text type="label">{`${translate('common.subTotal')}: `}</Text>
        <Price
          basePrice={item.subtotal}
          currencyRate={1}
          currencySymbol={currencySymbol}
        />
      </View>
      <View style={styles.row}>
        <Text type="label">
          {`${translate('orderListItem.shippingAndHandling')}: `}
        </Text>
        <Price
          basePrice={item.shipping_amount}
          currencyRate={1}
          currencySymbol={currencySymbol}
        />
      </View>
      <View style={styles.row}>
        <Text type="label" bold>
          {`${translate('common.grandTotal')}: `}
        </Text>
        <Price
          basePrice={item.total_due}
          currencyRate={1}
          currencySymbol={currencySymbol}
        />
      </View>
    </View>
  );
};

OrderScreen.navigationOptions = ({ navigation }) => ({
  title: `${translate('common.order')} # ${
    navigation.state.params.item.increment_id
  }`,
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
  orderProductDetail: PropTypes.func.isRequired,
};

OrderScreen.defaultProps = {};

const mapStateToProps = ({ account, magento }) => {
  const { products } = account;
  return {
    products,
  };
};

export default connect(mapStateToProps, {
  orderProductDetail,
})(OrderScreen);
