import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../common';
import { AirbnbRating } from 'react-native-ratings';
import moment from 'moment';
import Typography from '../../../theme/typography';
import { Spacer } from '../../common/Spacer';
import {
  ProductReviewItemRatingVotes,
  ProductReviewItemType,
} from '../../../magento/types';

const CustomerReviews: FC<{
  reviews: ProductReviewItemType[];
}> = ({ reviews }) => {
  const renderRatings = (ratings: ProductReviewItemRatingVotes[]) =>
    ratings.map(rating => (
      <View
        style={[styles.row, styles.ratingsWrap]}
        key={`${rating.rating_id}`}>
        <Text style={styles.ratingTitle}>{rating.rating_code}</Text>
        <AirbnbRating
          showRating={false}
          size={20}
          isDisabled
          // onFinishRating={val => setValue(val)}
          defaultRating={Number.parseInt(rating.value)}
        />
      </View>
    ));

  return (
    <View style={styles.container}>
      {reviews.map((review, index) => (
        <View key={index}>
          <Text style={styles.title}>{review.title}</Text>
          {renderRatings(review.rating_votes)}
          <Spacer size={5} />
          <Text style={styles.detail}>{review.detail}</Text>
          <Spacer size={5} />
          <View style={[styles.row, styles.reviewByWrap]}>
            <Text style={styles.reviewByText}>
              Review by
              <Text style={[styles.reviewByText, styles.bold]}>
                {' '}
                {review.nickname}
              </Text>
            </Text>
            <Spacer size={20} />
            <Text style={styles.reviewByText}>
              Posted on {moment(review.created_at).format('MM/DD/YY')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    ...(Typography.headingText as object),
    marginBottom: 10,
  },
  ratingTitle: {
    ...(Typography.captionText as object),
    width: 50,
  },
  row: {
    flexDirection: 'row',
  },
  ratingsWrap: {
    marginBottom: 6,
    alignItems: 'center',
  },
  detail: {
    ...(Typography.bodyText as object),
    fontSize: 14,
  },
  reviewByWrap: {
    marginTop: 6,
    marginBottom: 10,
  },
  reviewByText: {
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default CustomerReviews;
