import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Price } from '../../src/components/common';
import { ThemeProvider, theme } from '../../src/theme';

storiesOf('Price', module)
  .addDecorator(getStory => (
    <ThemeProvider theme={theme}>{getStory()}</ThemeProvider>
  ))
  .add('with basePrice', () => (
    <Price
      basePrice={300}
      currencySymbol="$"
      currencyRate={1}
    />
  ))
  .add('with discountPrice', () => (
    <Price
      basePrice={300}
      discountPrice={200}
      currencySymbol="$"
      currencyRate={1}
    />
  ))
  .add('with discountPrice = basePrice', () => (
    <Price
      basePrice={300}
      discountPrice={300}
      currencySymbol="$"
      currencyRate={1}
    />
  ));
