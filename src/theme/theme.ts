import colors from './colors';
import spacing from './spacing';
import dimens from './dimens';
import typography from './typography';

export type ThemeType = {
  colors: Record<string, string>;
  spacing: Record<string, number>;
  dimens: Record<string, number>;
  typography: Record<string, any>;
};

const theme: ThemeType = {
  colors,
  spacing,
  dimens,
  typography,
};

export default theme;
