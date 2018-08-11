import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Sizes from '../../constants/Sizes';
import { priceSignByCode } from '../../helper/price';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { magento } from '../../magento';

const FeaturedProductItem = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.containerStyle}
        onPress={() => { props.onPress(props); }}
      >
        <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={{ uri: getProductThumbnailFromAttribute(props) }}
        />
        <View style={styles.infoStyle}>
          <Text style={styles.textStyle}>{props.name}</Text>
          <Text style={styles.priceStyle}>
            {priceSignByCode(
              magento.storeConfig.default_display_currency_code
            )}{' '}
            {props.price}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

FeaturedProductItem.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  onPress: PropTypes.func,
};

FeaturedProductItem.defaultProps = {
  products: {},
  style: {},
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    width: Sizes.WINDOW_WIDTH * 0.32,
  },
  containerStyle: {
    flexDirection: 'column',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '200',
    color: '#555',
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'center',
  },
  imageStyle: {
    height: 80,
    width: 80,
  }
});

export default FeaturedProductItem;
