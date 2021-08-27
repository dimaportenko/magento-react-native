import React from 'react';
import theme, { ThemeType } from './theme';

const ThemeContext = React.createContext<ThemeType>(theme);

export default ThemeContext;
