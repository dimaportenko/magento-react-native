import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { setCurrentProduct } from '../../actions';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_PRODUCT_PATH } from '../../navigation/routes';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { magento } from '../../magento';
import { priceSignByCode } from '../../helper/price';

class ProductListItem extends Component {
  onRowPress() {
    const { product } = this.props;
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_PRODUCT_PATH, {
      title: product.name
    });
  }

  image() {
    return getProductThumbnailFromAttribute(this.props.product);
  }

  render() {
    const {
      imageStyle,
      containerStyle,
      textStyle,
      infoStyle,
      priceStyle
    } = styles;
    return (
      <View>
        <TouchableOpacity
          style={containerStyle}
          onPress={this.onRowPress.bind(this)}
        >
          <Image
            style={imageStyle}
            resizeMode="contain"
            source={{ uri: this.image() }}
          />
          <View style={infoStyle}>
            <Text style={textStyle}>{this.props.product.name}</Text>
            <Text style={priceStyle}>
              {priceSignByCode(
                magento.storeConfig.default_display_currency_code
              )}
              {this.props.product.price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    flex: 1,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff'
  },
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 2
  },
  textStyle: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    fontWeight: '200'
  },
  priceStyle: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    fontSize: 20,
    fontWeight: '300',
    color: '#555'
  },
  imageStyle: {
    height: 100,
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: null
  }
};

export default connect(null, { setCurrentProduct })(ProductListItem);
