import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { priceSignByCode } from '../../helper/price';

class OrderScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Order # ${navigation.state.params.item.increment_id}`
  });

  renderItem = (item) => {
    const { code, text, container } = styles;
    const currency = priceSignByCode(this.props.navigation.state.params.item.order_currency_code);

    return (
      <View style={container}>
        <Text style={code} >{`Product Name: ${item.item.name}`}</Text>
        <Text style={text} >{`SKU: ${item.item.sku}`}</Text>
        <Text style={text} >
          {`Price: ${currency} ${item.item.price}`}
        </Text>
        <Text style={text} >{`Qty: ${item.item.qty_ordered}`}</Text>
        <Text style={text} >{`Subtotal: ${currency} ${item.item.row_total}`}</Text>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { text, container } = styles;
    const currency = priceSignByCode(this.props.navigation.state.params.item.order_currency_code);

    return (
      <View style={[container, { backgroundColor: '#F5F5F5' }]}>
        <FlatList
          data={navigation.state.params.item.items}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={text}>{`Status: ${this.props.navigation.state.params.item.status}`}</Text>
        <Text style={text}>
          {`Subtotal: ${currency} ${this.props.navigation.state.params.item.subtotal}`}
        </Text>
        <Text style={text}>
          {`Shipping & Handling: ${currency} ${this.props.navigation.state.params.item.shipping_amount}`}
        </Text>
        <Text style={[text, { fontWeight: 'bold' }]}>
          {`Grand Total: ${currency} ${this.props.navigation.state.params.item.total_due}`}
        </Text>
      </View>
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

export default OrderScreen;
