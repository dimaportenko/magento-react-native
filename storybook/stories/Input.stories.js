import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Input } from '../../src/components/common';
import { ThemeProvider, theme } from '../../src/theme';

const styles = {
  labelStyle: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 22,
  },
  inputStyle: {
    color: 'green',
  },
  containerStyle: {
    height: 60,
    backgroundColor: '#444',
    borderBottomWidth: 5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

storiesOf('Input', module)
  .addDecorator(getStory => (
    <ThemeProvider theme={theme}>{getStory()}</ThemeProvider>
  ))
  .add('default', () => React.createElement(() => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChangeText={setValue}
        placeholder="Type name..."
      />
    )
  }))
  .add('with label', () => React.createElement(() => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChangeText={setValue}
        label="Name"
        placeholder="Enter name"
      />
    );
  }))
  .add('with custom input style', () => React.createElement(() => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChangeText={setValue}
        inputStyle={styles.inputStyle}
        placeholder="Type name..."
      />
    )
  }))
  .add('with custom label style', () => React.createElement(() => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChangeText={setValue}
        label="label"
        labelStyle={styles.labelStyle}
        placeholder="Type name..." />
    )
  }))
  .add('with custom container style', () => React.createElement(() => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChangeText={setValue}
        placeholderTextColor="#fff"
        inputStyle={{ color: '#fff' }}
        containerStyle={styles.containerStyle}
        placeholder="Type name..."
      />
    )
  }));
