/**
 * Created by Dima Portenko on 25.05.2020
 */
import React, { useEffect, useState } from 'react';
import { magento } from '../magento';
import { logError } from '../helper/logger';
import {
  ProductReviewResponse,
  ProductReviewType,
  ProductType,
} from '../magento/types';

type Props = {
  product: ProductType;
};

type Result = {
  reviews: ProductReviewType | undefined;
  loading: boolean;
  error: boolean | unknown;
};

export const useProductReviews = ({ product }: Props): Result => {
  const [reviews, setReviews] = useState<ProductReviewType | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | boolean>(false);

  const getReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      const result: ProductReviewResponse | undefined =
        await magento.admin.getProductReviews(product.id);

      if (result?.length) {
        setReviews(result[0]);
      }
    } catch (err) {
      setError(err);
      logError(err);
    }
    setLoading(false);
  }, [product.id]);

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
