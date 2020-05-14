/**
 * @flow
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useEffect, useState } from 'react';
import { magento } from '../magento';

export const useRelatedProducts = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  const getRelatedProducts = async (product) => {
    try {
      const result = await magento.admin.getLinkedProducts(product.sku, 'related');
      console.warn('result', result);
    } catch (e) {
      console.warn('error', e);
    }
  };

  useEffect(() => {
    getRelatedProducts(product);
  }, [product]);

  return { relatedProducts };
};
