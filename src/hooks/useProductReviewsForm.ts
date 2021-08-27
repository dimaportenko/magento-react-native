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

type Props = {};

type Result = {
  reviews: {},
  loading: boolean,
};

export const useProductReviewsForm = (props: Props): Result => {
  const [loading, setLoading] = useState(false);
  const [postReviewLoading, setPostReviewLoading] = useState(false);
  const [error, setError] = useState(false);

  const ratingOptions = useSelector(({ product }) => product.ratingOptions);
  const dispatch = useDispatch();

  const getAvailableRatings = async () => {
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
  };

  const postReview = async review => {
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
        Alert.alert('Success', result[0]);
        success = true;
      } else if (result && result.length && result[0].message) {
        success = result[0].status;
      }

      if (!success) {
        Alert.alert('Fail', result[0].message);
      } else if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      logError(error);
      Alert.alert('Fail', error.message || 'Post review fail!');
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
