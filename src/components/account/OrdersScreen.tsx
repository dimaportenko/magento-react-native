import React, { useEffect, useContext, FC } from 'react';
import moment from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import {
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  ListRenderItemInfo,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { getOrdersForCustomer } from '../../actions';
import { Text } from '../common';
import OrderListItem from './OrderListItem';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

import { NAVIGATION_HOME_SCREEN_PATH } from '../../navigation/routes';
import { OrderType } from '../../magento/types';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ account }: StoreStateType) => {
  const customerId = account.customer ? account.customer.id : null;
  const orders = account.orderData ? account.orderData.items : [];
  return {
    customerId,
    orders,
    refreshing: account.refreshing,
  };
};

const connector = connect(mapStateToProps, {
  getOrdersForCustomer,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const OrdersScreen: FC<Props> = ({
  orders = null,
  customerId,
  refreshing,
  getOrdersForCustomer: _getOrdersForCustomer,
  navigation,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (customerId !== null) {
      _getOrdersForCustomer(customerId, true);
    }
  }, [_getOrdersForCustomer, customerId]);

  const onRefresh = () => {
    if (customerId !== null) {
      _getOrdersForCustomer(customerId, true);
    }
  };

  const renderItem = (orderItem: ListRenderItemInfo<OrderType>) => (
    <OrderListItem item={orderItem.item} />
  );

  const renderOrderList = () => {
    const data = orders?.sort((b, a) =>
      moment(a.created_at).diff(b.created_at),
    );

    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderEmptyOrderList = () => {
    const { navigate } = navigation;
    return (
      <View style={styles.emptyListContainerStyle(theme)}>
        <Text type="heading" style={styles.textStyle(theme)}>
          {translate('ordersScreen.noOrderMessage')}
        </Text>
        <TouchableOpacity onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}>
          <Text type="heading" bold style={styles.buttonTextStyle(theme)}>
            {translate('common.continueShopping')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (orders && orders.length) {
    return <View style={styles.container(theme)}>{renderOrderList()}</View>;
  }
  return renderEmptyOrderList();
};

// @ts-ignore
OrdersScreen.navigationOptions = () => ({
  title: translate('ordersScreen.title'),
  headerBackTitle: ' ',
});

const styles = {
  container: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  emptyListContainerStyle: (theme: ThemeType): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  }),
  textStyle: (theme: ThemeType) => ({
    paddingTop: theme.spacing.small,
  }),
  buttonTextStyle: (theme: ThemeType): TextStyle => ({
    padding: theme.spacing.large,
    top: 0,
    color: theme.colors.secondary,
  }),
};

export default connector(OrdersScreen);
