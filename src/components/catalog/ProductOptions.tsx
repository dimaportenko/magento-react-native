/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { getProductCustomAttribute } from '../../helper/product';
import { ModalSelect } from '../common';
import { ThemeContext } from '../../theme';
import { getProductMedia, uiProductUpdate } from '../../actions';
import _ from 'lodash';
import { ProductType } from '../../magento/types';
import {
  ProductCurrentReducerType,
  ProductOptionType,
} from '../../reducers/ProductReducer';
import { ThemeType } from '../../theme/theme';

type Props = {
  currentProduct: ProductCurrentReducerType;
  product: ProductType;
  setSelectedProduct: (item: ProductType) => void;
};

export const ProductOptions = ({
  currentProduct,
  product,
  setSelectedProduct,
}: Props) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { options, attributes, selectedOptions } = currentProduct;

  if (!(Array.isArray(options) && product.children)) {
    return <View />;
  }

  const optionSelect = (attributeId: string, optionValue: string) => {
    const { selectedOptions } = currentProduct;
    const updatedOptions = { ...selectedOptions, [attributeId]: optionValue };
    dispatch(uiProductUpdate(updatedOptions, product.id));

    updateSelectedProduct(updatedOptions);
  };

  const updateSelectedProduct = (selectedOptions: Record<string, number>) => {
    const { attributes, options } = currentProduct;
    const selectedKeys = Object.keys(selectedOptions);

    if (!product.children || !selectedKeys.length) {
      return;
    }

    if (selectedKeys.length === options.length) {
      const searchOption: Record<string, number> = {};
      selectedKeys.forEach(attribute_id => {
        const code = attributes[attribute_id].attributeCode;
        searchOption[code] = selectedOptions[attribute_id];
      });

      const _selectedProduct = product.children.find(child => {
        const found = _.every(searchOption, (value, code) => {
          const childOption = getProductCustomAttribute(child, code);
          return Number(childOption.value) === Number(value);
        });
        return found;
      });

      if (_selectedProduct) {
        const { medias } = currentProduct;
        setSelectedProduct(_selectedProduct);
        if (!medias || !medias[_selectedProduct.sku]) {
          dispatch(
            getProductMedia({ sku: _selectedProduct.sku, id: product.id }),
          );
        }
      }
    }
  };

  const prevOptions: ProductOptionType[] = [];
  let first = true;
  return (
    <>
      {options.map(option => {
        if (!attributes[option.attribute_id]) {
          return <View key={option.id} />;
        }

        let data = option.values.map(value => {
          let optionLabel = value.value_index.toString();

          if (attributes && attributes[option.attribute_id]) {
            const findedValue = attributes[option.attribute_id].options.find(
              optionData =>
                Number(optionData.value) === Number(value.value_index),
            );
            if (findedValue) {
              optionLabel = findedValue.label;
            }
          }

          if (first) {
            return {
              label: optionLabel,
              key: value.value_index.toString(),
            };
          }

          const match = product.children?.find(child => {
            let found = 0;
            prevOptions.every(prevOption => {
              const { attributeCode } = attributes[prevOption.attribute_id];
              const currentAttributeCode =
                attributes[option.attribute_id].attributeCode;
              const childOption = getProductCustomAttribute(
                child,
                attributeCode,
              );
              const currentOption = getProductCustomAttribute(
                child,
                currentAttributeCode,
              );
              const selectedValue =
                selectedOptions[prevOption.attribute_id as number];
              if (
                Number(childOption.value) === Number(selectedValue) &&
                Number(currentOption.value) === Number(value.value_index)
              ) {
                found++;
                return false;
              }
              return true;
            });
            return found === prevOptions.length;
          });

          if (match) {
            return {
              label: optionLabel,
              key: value.value_index,
            };
          }
          return false;
        });
        data = data.filter(object => object !== false);
        first = false;
        prevOptions.push(option);

        return (
          <ModalSelect
            style={styles.modalStyle(theme)}
            disabled={data.length === 0}
            key={option.id}
            label={option.label}
            attribute={option.attribute_id as string}
            data={
              data as {
                key: string;
                label: string;
              }[]
            }
            onChange={optionSelect}
          />
        );
      })}
    </>
  );
};

const styles = {
  modalStyle: (theme: ThemeType): ViewStyle => ({
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
    marginBottom: theme.spacing.large,
  }),
};
