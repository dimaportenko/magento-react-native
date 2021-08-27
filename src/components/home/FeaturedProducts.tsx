import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '../common';
import FeaturedProductItem from './FeaturedProductItem';
import { ThemeContext } from '../../theme';

const FeaturedProducts = ({
  style,
  title,
  products,
  currencySymbol,
  currencyRate,
  onPress,
}) => {
  const theme = useContext(ThemeContext);

  const keyExtractor = item => item.id.toString();

  return (
    <View style={[styles.container(theme), style]}>
      <Text type="heading" style={styles.title}>
        {title}
      </Text>
      <FlatList
        horizontal
        data={products.items}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <FeaturedProductItem
            product={item}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
            onPress={onPress}
          />
        )}
      />
    </View>
  );
};

FeaturedProducts.propTypes = {
  products: PropTypes.object,
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.object,
  currencySymbol: PropTypes.string.isRequired,
  currencyRate: PropTypes.number.isRequired,
};

FeaturedProducts.defaultProps = {
  products: {},
  style: {},
};

const styles = StyleSheet.create({
  container: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.3,
    paddingTop: 10,
  }),
  title: {
    textAlign: 'center',
  },
});

export default FeaturedProducts;
