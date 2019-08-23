import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text, View, Image, TouchableOpacity,
} from 'react-native';
import { getProductThumbnailFromAttribute } from '../../helper/product';

class ProductListItem extends Component {
  image() {
    return getProductThumbnailFromAttribute(this.props.product);
  }

  render() {
    const {
      imageStyle,
      containerStyle,
      textStyle,
      infoStyle,
      priceStyle,
    } = styles;


    return (
      <View style={this.props.viewContainerStyle}>
        <TouchableOpacity
          style={[containerStyle, this.props.columnContainerStyle]}
          onPress={() => { this.props.onRowPress(this.props.product); }}
        >

          <Image
            style={[imageStyle, this.props.imageStyle]}
            resizeMode="contain"
            source={{ uri: this.image() }}
          />
          <View style={[infoStyle, this.props.infoStyle]}>
            <Text style={[textStyle, this.props.textStyle]}>{this.props.product.name}</Text>
            <Text style={[priceStyle, this.props.priceStyle]}>
              {`${this.props.currencySymbol} ${this.props.product.price}`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

ProductListItem.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    flex: 1,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    margin: 1,
  },
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 2,
  },
  textStyle: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    fontWeight: '200',
  },
  priceStyle: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    fontSize: 20,
    fontWeight: '300',
    color: '#555',
  },
  imageStyle: {
    height: 100,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: null,
  },
};

export { ProductListItem };
