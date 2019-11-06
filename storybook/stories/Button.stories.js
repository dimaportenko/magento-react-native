import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button } from '../../src/components/common';
import { ThemeProvider, theme } from '../../src/theme';

const onPress = () => console.log('On Press click!');

const styles = {
  customButton: {
    borderWidth: 2,
    backgroundColor: 'salmon',
    borderColor: 'red',
    height: 60,
  }
};

storiesOf('Button', module)
  .addDecorator(getStory => (
    <ThemeProvider theme={theme}>{getStory()}</ThemeProvider>
  ))
  .add('default', () => (
    <Button onPress={onPress}>Default Button</Button>
  ))
  .add('disabled button', () => (
    <Button disabled onPress={onPress}>Disabled Button</Button>
  ))
  .add('custom Button', () => (
    <Button style={styles.customButton} onPress={onPress}>Custom button</Button>
  ));
