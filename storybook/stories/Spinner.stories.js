import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Spinner } from '../../src/components/common';
import { ThemeProvider, theme } from '../../src/theme';

const styles = {
  container: {
    backgroundColor: 'pink',
  }
};

storiesOf('Spinner', module)
  .addDecorator(getStory => (
    <ThemeProvider theme={theme}>{getStory()}</ThemeProvider>
  ))
  .add('default', () => (
    <Spinner />
  ))
  .add('small size', () => (
    <Spinner size="small" />
  ))
  .add('large size', () => (
    <Spinner size="large" />
  ))
  .add('custom style', () => (
    <Spinner style={styles.container} />
  ));
