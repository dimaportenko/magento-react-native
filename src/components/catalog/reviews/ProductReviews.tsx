/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Sizes from '../../../theme/dimens';
import { useProductReviews } from '../../../hooks/useProductReviews';
import CustomerReviews from './CustomerReviews';
import { Spinner, Text } from '../../common';
import Typography from '../../../theme/typography';
import { Spacer, Row } from '../../common';
import { ProductType } from '../../../magento/types';

type Props = {
  product: ProductType;
};

export const ProductReviews = ({ product }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [iconName, setIconName] = useState('angle-down');
  const { reviews, loading } = useProductReviews({ product });

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
    <View style={[Typography.headingText, styles.customerReviewsWrap]}>
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
    marginTop: Sizes.WINDOW_WIDTH * 0.05,
    margin: 10,
  },
  expandHeaderRow: {
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  expandHeaderWrap: {
    justifyContent: 'space-between',
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  customerReviewsTitle: {},
});
