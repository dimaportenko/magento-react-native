import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { orderProductDetail } from '../../actions';
import { getProductThumbnailFromAttribute } from '../../helper/product';

class OrderScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Order # ${navigation.state.params.item.increment_id}`,
  });

  componentDidMount() {
    const { navigation } = this.props;
    navigation.state.params.item.items.forEach((item) => {
      if (!(item.sku in this.props.products)) {
        this.props.orderProductDetail(item.sku);
      }
    });
  }

  image = (item) => {
    const { products } = this.props;
    if (products[item.sku]) {
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };

  renderItem = (item) => {
    const {
      code, text, row, imageStyle, container,
    } = styles;
    const { currencySymbol } = this.props;

    return (
      <View style={container}>
        <View style={row}>
          <Image style={imageStyle} resizeMode="contain" source={{ uri: this.image(item.item) }} />
          <View>
            <Text style={code}>{item.item.name}</Text>
            <Text style={text}>{`SKU: ${item.item.sku}`}</Text>
            <Text style={text}>
              {`Price: ${currencySymbol} ${item.item.price}`}
            </Text>
            <Text style={text}>{`Qty: ${item.item.qty_ordered}`}</Text>
            <Text style={text}>{`Subtotal: ${currencySymbol} ${item.item.row_total}`}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { navigation, currencySymbol } = this.props;
    const { item } = navigation.state.params;
    const { text, container } = styles;

    return (
      <View style={[container, { backgroundColor: '#F5F5F5' }]}>
        <FlatList
          data={[...item.items]}
          renderItem={this.renderItem}
          keyExtractor={(_item, index) => index.toString()}
        />
        <Text style={text}>{`Status: ${item.status}`}</Text>
        <Text style={text}>
          {`Subtotal: ${currencySymbol} ${item.subtotal}`}
        </Text>
        <Text style={text}>
          {`Shipping & Handling: ${currencySymbol} ${item.shipping_amount}`}
        </Text>
        <Text style={[text, { fontWeight: 'bold' }]}>
          {`Grand Total: ${currencySymbol} ${item.total_due}`}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  code: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});

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
