/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { ModalSelect } from '../common';
import { uiProductCustomOptionUpdate } from '../../actions';
import { ThemeContext } from '../../theme';
import { ProductCurrentReducerType } from '../../reducers/ProductReducer';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

type Props = {
  currentProduct: ProductCurrentReducerType;
  product: ProductType;
};

export const ProductCustomOptions = ({ currentProduct, product }: Props) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { customOptions } = currentProduct;

  if (!customOptions) {
    return <View />;
  }

  const customOptionSelect = (optionId: string, optionValue: string) => {
    const { selectedCustomOptions } = currentProduct;
    const updatedCustomOptions = {
      ...selectedCustomOptions,
      [optionId]: optionValue,
    };
    dispatch(uiProductCustomOptionUpdate(updatedCustomOptions, product.id));
  };

  return (
    <>
      {customOptions.map(option => {
        const data = option.values.map(value => ({
          label: value.title,
          key: value.option_type_id.toString(),
        }));

        return (
          <ModalSelect
            style={styles.modalStyle(theme)}
            disabled={data.length === 0}
            key={option.option_id}
            label={option.title}
            attribute={option.option_id.toString()}
            data={data}
            onChange={customOptionSelect}
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
