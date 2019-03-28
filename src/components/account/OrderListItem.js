import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { priceSignByCode } from '../../helper/price';
import { NAVIGATION_ORDER_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';

class OrderListItem extends Component {

  openOrdersScreen = (item) => {
    NavigationService.navigate(NAVIGATION_ORDER_PATH, {
      item,
    });
  };

  render() {
    const { item } = this.props;
    const { code, text, container } = styles;

    return (
      <TouchableOpacity onPress={() => this.openOrdersScreen(item)}>
        <View style={container}>
          <Text style={code} >{`Order # ${item.increment_id}`}</Text>
          <Text style={text} >{`Created: ${item.created_at}`}</Text>
          <Text style={text} >
            {`Ship to ${item.customer_firstname} ${item.customer_lastname}`}
          </Text>
          <Text style={text} >
            {`Order Total: ${priceSignByCode(item.order_currency_code)} ${item.grand_total}`}
          </Text>
          <Text style={text} >{`Status: ${item.status}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 3,
    marginTop: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  code: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});

export default OrderListItem;
