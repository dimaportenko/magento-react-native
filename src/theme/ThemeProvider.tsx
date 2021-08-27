import React, { FC } from 'react';
import ThemeContext from './ThemeContext';
import { ThemeType } from './theme';

const ThemeProvider: FC<{
  theme: ThemeType;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export default ThemeProvider;
