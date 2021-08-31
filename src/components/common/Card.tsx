import React, { FC, useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../theme';
import { ThemeType } from '../../theme/theme';

const Card: FC<{
  style: ViewStyle;
}> = ({ children, style }) => {
  const theme = useContext(ThemeContext);
  return <View style={[styles.containerStyles(theme), style]}>{children}</View>;
};

const styles = {
  containerStyles: (theme: ThemeType) => ({
    borderWidth: 1,
    borderRadius: theme.dimens.borderRadius,
    borderColor: theme.colors.border,
    borderBottomWidth: 0,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: theme.spacing.tiny,
    marginRight: theme.spacing.tiny,
    marginTop: theme.spacing.small,
  }),
};

export { Card };
