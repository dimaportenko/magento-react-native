// libraries
import React, { useContext } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { ThemeContext } from '../../theme';

const MaterialHeaderButton = (props) => {
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

export const MaterialHeaderButtons = (props) => {
  const theme = useContext(ThemeContext);
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcons name="more-vert" size={theme.dimens.headerButtonSize} color={theme.colors.appbarTint} />}
      {...props}
    />
  );
};

export const { Item } = HeaderButtons;
