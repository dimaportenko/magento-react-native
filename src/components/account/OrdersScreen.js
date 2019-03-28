import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  getOrdersForCustomer,
  setCurrentProduct,
} from '../../actions';
import OrderListItem from './OrderListItem';

import { NAVIGATION_HOME_SCREEN_PATH } from '../../navigation/routes';


class OrdersScreen extends Component {
  static navigationOptions = () => ({
    title: 'Orders',
    headerBackTitle: ' '
  });

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.getOrdersForCustomer(this.props.customerId);
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.getOrdersForCustomer(this.props.customerId);
    this.setState({ refreshing: false });
  };

  renderItem = (orderItem) => {
    return (
      <OrderListItem item={orderItem.item} />
    );
  };

  renderOrderList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        data={this.props.orders}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  renderEmptyOrderList = () => {
    const { navigate } = this.props.navigation;
    const {
      emptyListContainerStyle,
      textStyle,
      buttonTextStyle
    } = styles;


    return (
      <View style={emptyListContainerStyle}>
        <Text style={textStyle}>
          Oops, there is no orders yet
        </Text>
        <TouchableOpacity
          onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}
        >
          <Text style={buttonTextStyle}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { orders } = this.props;

    if (orders && orders.length) {
      return (
        <View style={styles.containerStyle}>
          {this.renderOrderList()}
        </View>
      );
    }
    return this.renderEmptyOrderList();
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyListContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 20,
    paddingTop: 7,
  },
  buttonTextStyle: {
    padding: 14,
    fontSize: 20,
    top: 0,
    color: '#3478f6',
  },
};

const mapStateToProps = ({ account }) => {
  const customerId = account.customer ? account.customer.id : null;
  const orders = account.orderData ? account.orderData.items : [];
  return {
    customerId,
    orders,
  };
};

export default connect(mapStateToProps, {
  getOrdersForCustomer,
  setCurrentProduct
})(OrdersScreen);
