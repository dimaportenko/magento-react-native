/**
 * @flow
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useEffect, useState } from 'react';
import { magento } from '../magento';
import { logError } from '../helper/logger';

type Props = {
  product: {
    id: number,
  },
};

type Result = {
  reviews: {},
  loading: boolean,
};

export const useProductReviews = ({ product }: Props): Result => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getReviews = async () => {
    try {
      setLoading(true);
      const result = await magento.admin.getProductReviews(product.id);
      if (result.length) {
        setReviews(result[0]);
      }
    } catch (err) {
      setError(err);
      logError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (product?.id) {
      getReviews();
    }
  }, [getReviews, product]);

  return {
    reviews,
    error,
    loading,
  };
};
