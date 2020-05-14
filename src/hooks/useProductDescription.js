/**
 * @flow
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useMemo } from 'react';
import { getProductCustomAttribute } from '../helper/product';
import { logError } from '../helper/logger';

export const useProductDescription = ({ product }) => {
  const description = useMemo(() => {
    let desc = '';
    const attribute = getProductCustomAttribute(product, 'description');
    if (attribute) {
      desc = attribute.value.replace(/<\/?[^>]+(>|$)/g, '');
      // try {
      //   desc = decodeURI(description);
      // } catch (e) {
      //   logError(e);
      // }
    }
    return desc;
  }, [product]);

  return {
    description,
  };
};
