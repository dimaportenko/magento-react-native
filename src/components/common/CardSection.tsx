import React, { FC, useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../theme';

const CardSection: FC<{
  style: ViewStyle;
}> = ({ children, style }) => {
  const theme = useContext(ThemeContext);
  return <View style={[styles.containerStyles(theme), style]}>{children}</View>;
};

const styles = {
  containerStyles: theme => ({
    borderBottomWidth: 1,
    padding: theme.spacing.tiny,
    backgroundColor: theme.colors.surface,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: theme.colors.border,
    position: 'relative',
  }),
};

export { CardSection };
