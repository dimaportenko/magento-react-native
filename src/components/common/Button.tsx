import React, { FC, useContext } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from './Text';
import { ThemeContext } from '../../theme';

const Button: FC<{
  onPress: () => void;
  style: ViewStyle;
  disabled: boolean;
}> = ({ onPress, children, style, disabled }) => {
  const theme = useContext(ThemeContext);
  const { buttonStyle, buttonTitle } = styles;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle(theme, disabled), style]}
      disabled={disabled}>
      <Text style={buttonTitle(theme, disabled)}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: (theme, disabled) => ({
    borderWidth: 1,
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.secondary,
    borderColor: disabled
      ? theme.colors.disabledDark
      : theme.colors.secondaryDark,
    width: theme.dimens.defaultButtonWidth,
    height: theme.dimens.defaultButtonHeight,
    justifyContent: 'center',
  }),
  buttonTitle: (theme, disabled) => ({
    color: disabled ? theme.colors.disabledDark : theme.colors.white,
    alignSelf: 'center',
  }),
});

export { Button };
