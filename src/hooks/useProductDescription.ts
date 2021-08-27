/**
 * Created by Dima Portenko on 14.05.2020
 */
import { useEffect, useState } from 'react';
import { getProductCustomAttribute } from '../helper/product';

export const useProductDescription = ({ product }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const attribute = getProductCustomAttribute(product, 'description');
    if (attribute) {
      setDescription(attribute.value);
    }
  }, [product]);

  return {
    description,
  };
};
