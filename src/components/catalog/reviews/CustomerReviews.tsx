import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../common';
import { Spacer } from 'react-native-markup-kit';
import { AirbnbRating, Rating } from 'react-native-ratings';
import moment from 'moment';
import Typography from '../../../theme/typography';

const CustomerReviews = ({ reviews }) => {
  const renderRatings = ratings =>
    ratings.map(rating => (
      <View style={[styles.row, styles.ratingsWrap]}>
        <Text style={styles.ratingTitle}>{rating.rating_code}</Text>
        <AirbnbRating
          showRating={false}
          size={20}
          isDisabled
          // onFinishRating={val => setValue(val)}
          defaultRating={rating.value}
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
    ...Typography.headingText,
    marginBottom: 10,
  },
  ratingTitle: {
    ...Typography.captionText,
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
    ...Typography.bodyText,
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

CustomerReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      detail: PropTypes.string,
      nickname: PropTypes.string,
      created_at: PropTypes.string,
      review_id: PropTypes.string || PropTypes.number,
      rating_votes: PropTypes.arrayOf(
        PropTypes.shape({
          rating_code: PropTypes.string,
          value: PropTypes.string || PropTypes.number,
        }),
      ),
    }),
  ),
};

CustomerReviews.defaultProps = {
  reviews: [],
};

export default CustomerReviews;
