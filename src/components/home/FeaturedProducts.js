import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Sizes from '../../constants/Sizes';
import FeaturedProductItem from './FeaturedProductItem';


const FeaturedProducts = props => {
  const keyExtractor = item => item.id.toString();

  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.title}>{props.title}</Text>
      <FlatList
        horizontal
        data={props.products.items}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <FeaturedProductItem {...item} onPress={props.onPress} />}
      />
    </View>
  );
};

FeaturedProducts.propTypes = {
  products: PropTypes.object,
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.object,
};

FeaturedProducts.defaultProps = {
  products: {},
  style: {},
};

const styles = StyleSheet.create({
  container: {
    height: Sizes.WINDOW_HEIGHT * 0.3,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FeaturedProducts;
