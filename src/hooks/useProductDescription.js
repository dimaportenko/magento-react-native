/**
 * @flow
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useEffect, useState } from 'react';
import { getProductCustomAttribute } from '../helper/product';

export const useProductDescription = ({ product }) => {
  const [description, setDescription] = useState('');

  const decode = async (desc) => {
    let _desc = desc;
    try {
      _desc = decodeURI(desc);
    } catch (e) {

    }
    setDescription(_desc);
  };

  useEffect(() => {
    let desc = '';
    const attribute = getProductCustomAttribute(product, 'description');
    if (attribute) {
      desc = attribute.value.replace(/<\/?[^>]+(>|$)/g, '');
      desc = desc.replace('&bull;', '\n•');
      decode(desc);
    }
  }, [product]);

  return {
    description,
  };
};
