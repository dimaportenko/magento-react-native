/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductMedia from './ProductMedia';
import { getProductMedia } from '../../actions';

export const ProductMediaContainer = ({ product, selectedProductSku }) => {
  const current = useSelector(({ product }) => product.current);
  const dispatch = useDispatch();

  useEffect(() => {
    const { medias } = current[product.id] || {};

    if (!medias || !medias[product.sku]) {
      dispatch(getProductMedia({ sku: product.sku, id: product.id }));
    }
  }, []); // eslint-disable-line

  const { medias } = current[product.id];
  if (!medias) {
    return <ProductMedia media={null} />;
  }
  if (selectedProductSku && medias[selectedProductSku]) {
    return <ProductMedia media={medias[selectedProductSku]} />;
  }
  return <ProductMedia media={medias[product.sku]} />;
};
