import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { orderProductDetail } from '../../actions';
import { priceSignByCode } from '../../helper/price';
import { getProductThumbnailFromAttribute } from '../../helper/product';

class OrderScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Order # ${navigation.state.params.item.increment_id}`
  });

  componentDidMount() {
    const { navigation } = this.props;
    navigation.state.params.item.items.forEach(item => {
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
	}

  renderItem = (item) => {
    const { code, text, row, imageStyle, container } = styles;
    const currency = priceSignByCode(this.props.navigation.state.params.item.order_currency_code);

    return (
      <View style={container}>
        <View style={row}>
          <Image style={imageStyle} resizeMode="contain" source={{ uri: this.image(item.item) }} />
          <View>
            <Text style={code} >{item.item.name}</Text>
            <Text style={text} >{`SKU: ${item.item.sku}`}</Text>
            <Text style={text} >
              {`Price: ${currency} ${item.item.price}`}
            </Text>
            <Text style={text} >{`Qty: ${item.item.qty_ordered}`}</Text>
            <Text style={text} >{`Subtotal: ${currency} ${item.item.row_total}`}</Text>
          </View>
        </View>
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

const mapStateToProps = ({ account }) => {
  const { products } = account;
  return {
    products
  };
};

export default connect(mapStateToProps, {
  orderProductDetail,
})(OrderScreen);
