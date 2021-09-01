import React, { FC, useContext } from 'react';
import { View, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { ThemeContext } from '../../theme';

const Spinner: FC<{
  size?: number | 'small' | 'large' | undefined;
  style?: ViewStyle;
}> = ({ size, style }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.spinnerStyle, style]}>
      <ActivityIndicator size={size} color={theme.colors.secondary} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Spinner };
