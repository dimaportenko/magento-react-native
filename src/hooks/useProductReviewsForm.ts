/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { magento } from '../magento';
import * as types from '../actions/types';
import { Alert } from 'react-native';
import { logError } from '../helper/logger';
import { StoreStateType } from '../reducers';
import { RatingOptionType } from '../reducers/ProductReducer';
import { ProductType } from '../magento/types';

type Props = {
  onSuccess?: () => void;
  product: ProductType;
};

type Result = {
  error: unknown;
  loading: boolean;
  postReviewLoading: boolean;
  ratingOptions: RatingOptionType[];
  postReview: (
    review: PostReviewData,
    callback: (success: boolean) => void,
  ) => void;
};

export type PostReviewRatingData = {
  ratingCode: string;
  ratingValue: string | number;
  rating_id: string;
};

export type PostReviewData = {
  detail: string;
  nickname: string;
  title: string;
  productId: number;
  ratingData: PostReviewRatingData[];
};

export const useProductReviewsForm = (props: Props): Result => {
  const [loading, setLoading] = useState(false);
  const [postReviewLoading, setPostReviewLoading] = useState(false);
  const [error, setError] = useState<unknown>(false);

  const ratingOptions = useSelector(
    ({ product }: StoreStateType) => product.ratingOptions,
  );
  const dispatch = useDispatch();

  const getAvailableRatings = React.useCallback(async () => {
    try {
      setLoading(true);
      const optionsResult = await magento.admin.getRatingOptions();
      dispatch({
        type: types.MAGENTO_PRODUCT_RATING_OPTIONS,
        payload: optionsResult,
      });
    } catch (error) {
      setError(error);
      logError(error);
    }
    setLoading(false);
  }, [dispatch]);

  const postReview = async (review: PostReviewData) => {
    try {
      setPostReviewLoading(true);
      let result;
      if (magento.isCustomerLogin()) {
        result = await magento.customer.postReview(review);
      } else {
        result = await magento.admin.postGuestReview(review);
      }

      let success = false;
      if (result && result.length && result[0] instanceof String) {
        Alert.alert('Success', result[0] as string);
        success = true;
      } else if (result && result.length && result[0].message) {
        success = result[0].status;
      }

      if (!success) {
        Alert.alert('Fail', result[0].message);
      } else if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (err) {
      logError(err);
      Alert.alert('Fail', (err as Error).message || 'Post review fail!');
    }
    setPostReviewLoading(false);
  };

  useEffect(() => {
    getAvailableRatings();
  }, [getAvailableRatings]);

  return {
    error,
    loading,
    postReviewLoading,
    ratingOptions,
    postReview,
  };
};
