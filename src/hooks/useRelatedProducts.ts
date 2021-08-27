/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useEffect, useState } from 'react';
import { magento } from '../magento';
import { MAGENTO_UPDATE_CONF_PRODUCT } from '../actions/types';
import { logError } from '../helper/logger';
import { getPriceFromChildren } from '../helper/product';

const getSearchCriteriaWithSkus = skus => ({
  groups: [
    [
      {
        field: 'sku',
        value: skus,
        conditionType: 'in',
      },
    ],
    [
      {
        field: 'visibility',
        value: '4',
        conditionType: 'eq',
      },
    ],
  ],
});

const updateConfigurableProductsPrices = products => {
  return products.map(product => {
    if (product.type_id === 'configurable') {
      return updateConfigurableProductPrice(product);
    }
    return product;
  });
};

const updateConfigurableProductPrice = async product => {
  try {
    const data = await magento.admin.getConfigurableChildren(product.sku);
    return {
      ...product,
      children: data,
      price: getPriceFromChildren(data),
    };
  } catch (e) {
    logError(e);
  }
};

export const useRelatedProducts = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getRelatedProducts = async product => {
    try {
      setLoading(true);
      setError(false);
      const linksData = await magento.admin.getLinkedProducts(
        product.sku,
        'related',
      );
      const skus = linksData.map(item => item.linked_product_sku);
      const data = await magento.admin.getProductsBy(
        getSearchCriteriaWithSkus(skus),
      );
      const products = await Promise.all(
        updateConfigurableProductsPrices(data.items),
      );

      setRelatedProducts(products);
      setLoading(false);
    } catch (error) {
      setError(error);
      logError(error);
    }
  };

  useEffect(() => {
    getRelatedProducts(product);
  }, [product]);

  return { relatedProducts, error, loading };
};
