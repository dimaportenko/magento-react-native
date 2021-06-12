/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Sizes from '../../../theme/dimens';
import { Row, Spacer } from 'react-native-markup-kit';
import { useProductReviews } from '../../../hooks/useProductReviews';
import CustomerReviews from './CustomerReviews';
import { Spinner, Text } from '../../common';
import Typography from '../../../theme/typography';

export const ProductReviews = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const [iconName, setIconName] = useState('angle-down');
  const { reviews, loading, error } = useProductReviews({ product });

  useEffect(() => {
    setIconName(expanded ? 'angle-up' : 'angle-down');
  }, [expanded]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );
  }

  if (!(reviews && reviews.count && reviews.reviews)) {
    return <View />;
  }

  return (
    <View style={styles.customerReviewsWrap}>
      <TouchableOpacity
        style={styles.expandHeaderRow}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        <Row style={styles.expandHeaderWrap}>
          <Text style={styles.customerReviewsTitle}>Customer Reviews</Text>
          <Icon name={iconName} type="font-awesome" color={'#737373'} />
        </Row>
        <Spacer size={10} />
      </TouchableOpacity>
      {expanded && (
        <View>
          <Spacer size={10} />
          <CustomerReviews reviews={reviews.reviews} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customerReviewsWrap: {
    // marginLeft: Sizes.WINDOW_WIDTH * 0.05,
    marginTop: Sizes.WINDOW_WIDTH * 0.05,
    margin: 10,
  },
  expandHeaderRow: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#eae9e9',
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  expandHeaderWrap: {
    justifyContent: 'space-between',
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  customerReviewsTitle: {
    ...Typography.headingText,
  },
});
