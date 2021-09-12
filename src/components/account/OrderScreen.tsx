import React, { useEffect, useContext, FC } from 'react';
import { View, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect, ConnectedProps } from 'react-redux';
import { Text, Price } from '../common';
import { orderProductDetail } from '../../actions';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';
import { OrderItemType, OrderType } from '../../magento/types';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ account }: StoreStateType) => {
  const { products } = account;
  return {
    products,
  };
};

const connector = connect(mapStateToProps, {
  orderProductDetail,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const OrderScreen: FC<Props> = ({
  products,
  navigation,
  orderProductDetail: _orderProductDetail,
}) => {
  const theme = useContext(ThemeContext);
  const currencySymbol = priceSignByCode(
    navigation.state.params.item.order_currency_code,
  );

  useEffect(() => {
    navigation.state.params.item.items.forEach((item: OrderItemType) => {
      if (!(item.sku in products)) {
        _orderProductDetail(item.sku);
      }
    });
  }, [_orderProductDetail, navigation.state.params.item.items, products]);

  const image = (item: OrderItemType) => {
    if (products[item.sku]) {
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };

  const renderItem = (item: ListRenderItemInfo<OrderItemType>) => (
    <View style={styles.itemContainer(theme)}>
      <View style={sh.row}>
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
          <View style={sh.row}>
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
          <View style={sh.row}>
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

  const { item }: { item: OrderType } = navigation.state.params;

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
      <View style={sh.row}>
        <Text type="label">{`${translate('common.subTotal')}: `}</Text>
        <Price
          basePrice={item.subtotal}
          currencyRate={1}
          currencySymbol={currencySymbol}
        />
      </View>
      <View style={sh.row}>
        <Text type="label">
          {`${translate('orderListItem.shippingAndHandling')}: `}
        </Text>
        <Price
          basePrice={item.shipping_amount}
          currencyRate={1}
          currencySymbol={currencySymbol}
        />
      </View>
      <View style={sh.row}>
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

// @ts-ignore
OrderScreen.navigationOptions = ({ navigation }: { navigation: any }) => ({
  title: `${translate('common.order')} # ${
    navigation.state.params.item.increment_id
  }`,
});

const sh = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

const styles = {
  container: (theme: ThemeType) => ({
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
    flex: 1,
  }),
  itemContainer: (theme: ThemeType) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
  }),
  imageStyle: (theme: ThemeType) => ({
    width: theme.dimens.orderImageWidth,
    height: theme.dimens.orderImageHeight,
  }),
};

export default connector(OrderScreen);
