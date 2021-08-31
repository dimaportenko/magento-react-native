import React, { FC, useContext } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  HeaderButtons,
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { ThemeContext } from '../../theme';

const MaterialHeaderButton: FC<HeaderButtonProps> = props => {
  const theme = useContext(ThemeContext);
  return (
    <HeaderButton
      IconComponent={MaterialIcons}
      iconSize={theme.dimens.headerButtonSize}
      color={theme.colors.appbarTint}
      {...props}
    />
  );
};

export const MaterialHeaderButtons: FC = props => {
  const theme = useContext(ThemeContext);
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={
        <MaterialIcons
          name="more-vert"
          size={theme.dimens.headerButtonSize}
          color={theme.colors.appbarTint}
        />
      }
      {...props}
    />
  );
};

export const { Item } = HeaderButtons;
