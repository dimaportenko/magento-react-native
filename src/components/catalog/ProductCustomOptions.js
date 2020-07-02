/**
 * Created by Dima Portenko on 14.05.2020
 */
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ModalSelect } from '../common';
import { ThemeContext } from '../../theme';

export const ProductCustomOptions = ({ currentProduct }) => {
  const theme = useContext(ThemeContext);
  const { customOptions } = currentProduct;

  if (!customOptions) {
    return <View />;
  }

  return customOptions.map((option) => {
    const data = option.values.map(value => ({
      label: value.title,
      key: value.option_type_id,
    }));

    return (
      <ModalSelect
        style={styles.modalStyle(theme)}
        disabled={data.length === 0}
        key={option.option_id}
        label={option.title}
        attribute={option.option_id}
        value={option.option_id}
        data={data}
        onChange={this.customOptionSelect}
      />
    );
  });
};

const styles = StyleSheet.create({
  modalStyle: theme => ({
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
    marginBottom: theme.spacing.large,
  }),
});

