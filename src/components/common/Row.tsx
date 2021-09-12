/**
 * Created by Dima Portenko on 28.08.2021
 */
import React, { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export const Row: FC<ViewProps> = props => (
  <View style={[styles.row, props.style]}>{props.children}</View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
