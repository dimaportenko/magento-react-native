import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './Text';
import { ThemeContext } from '../../theme';

const Button = ({ onPress, children, style, disabled }) => {
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

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  disabled: false,
};

export { Button };
