/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useState, useRef, useEffect, FC } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Row, Spacer, Spinner, Text } from '../../common';
import ReviewForm, { ReviewFormRefType } from './ReviewForm';
import {
  PostReviewData,
  PostReviewRatingData,
  useProductReviewsForm,
} from '../../../hooks/useProductReviewsForm';
import Sizes from '../../../theme/dimens';
import Colors from '../../../theme/colors';
import Typography from '../../../theme/typography';
import { ProductType } from '../../../magento/types';

export type SubmitReviewData = {
  [key: string]: string | number;
  nickname: string;
  title: string;
  detail: string;
};

export const ReviewFormContainer: FC<{
  product: ProductType;
}> = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [iconName, setIconName] = useState('angle-down');

  const reviewFormRef = useRef<ReviewFormRefType>();
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

  const submitReview = (data: SubmitReviewData) => {
    const ratingData: PostReviewRatingData[] = ratingOptions.map(option => ({
      rating_id: option.rating_id,
      ratingCode: option.rating_code,
      ratingValue: data[option.rating_code.toLowerCase()],
    }));
    const review: PostReviewData = {
      productId: product.id,
      nickname: data.nickname,
      title: data.title,
      detail: data.detail,
      ratingData,
    };
    postReview(review, (success: boolean) => {
      if (success) {
        reviewFormRef.current?.reset();
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
            onSubmit={submitReview}
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
    ...(Typography.headingText as object),
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
