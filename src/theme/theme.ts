import colors from './colors';
import spacing from './spacing';
import dimens from './dimens';
import typography from './typography';

export type ThemeType = {
  colors: typeof colors;
  spacing: typeof spacing;
  dimens: typeof dimens;
  typography: typeof typography;
};

const theme: ThemeType = {
  colors,
  spacing,
  dimens,
  typography,
};

export default theme;
