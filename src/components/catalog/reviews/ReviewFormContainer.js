/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Row, Spacer } from 'react-native-markup-kit';
import { Icon } from 'react-native-elements';
import { Spinner, Text } from '../../common';
import ReviewForm from './ReviewForm';
import { useProductReviewsForm } from '../../../hooks/useProductReviewsForm';
import Sizes from '../../../theme/dimens';
import Colors from '../../../theme/colors';
import Typography from '../../../theme/typography';

export const ReviewFormContainer = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [iconName, setIconName] = useState('angle-down');
  const [reviewFormRefs, setReviewFormRefs] = useState([]);
  const reviewFormRef = useRef();
  const { postReviewLoading, postReview, ratingOptions, loading } =
    useProductReviewsForm({
      product,
      onSuccess: () => setSuccess(true),
    });

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

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>Review submited - Thank you!</Text>
        <Text style={styles.successBody}>
          We are processing your review. This is may take several days, so we
          appriciate your patience.
        </Text>
      </View>
    );
  }

  const submitReview = data => {
    const ratingData = ratingOptions.map(option => ({
      rating_id: option.rating_id,
      ratingCode: option.rating_code,
      ratingValue: data[option.rating_code.toLowerCase()],
    }));
    const review = {
      productId: product.id,
      nickname: data.nickname,
      title: data.title,
      detail: data.detail,
      ratingData,
    };
    postReview(review, success => {
      if (success) {
        reviewFormRefs.current.reset();
      }
    });
  };

  return (
    <View style={styles.customerReviewsWrap}>
      <TouchableOpacity
        style={styles.expandHeaderRow}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        <Row style={styles.expandHeaderWrap}>
          <Text style={styles.customerReviewsTitle} bold>
            Write Your Own Review
          </Text>
          <Icon name={iconName} type="font-awesome" color={'#737373'} />
        </Row>
        <Spacer size={10} />
      </TouchableOpacity>
      {expanded && (
        <View>
          <Spacer size={10} />
          <ReviewForm
            ref={reviewFormRef}
            loading={postReviewLoading}
            productName={product.name}
            onMountRefs={refs => setReviewFormRefs(refs)}
            onSubmit={submitReview}
            ratingOptions={ratingOptions}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customerReviewsWrap: {
    // marginLeft: Sizes.WINDOW_WIDTH * 0.05,
    marginTop: Sizes.WINDOW_WIDTH * 0.05,
    fontSize: 20,
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
  successContainer: {
    marginHorizontal: Sizes.WINDOW_WIDTH * 0.05,
    marginTop: Sizes.WINDOW_WIDTH * 0.05,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
  },
  successBody: {
    fontSize: 15,
  },
});
