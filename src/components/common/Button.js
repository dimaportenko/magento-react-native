import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

const Button = ({ onPress, children, style, disabled }) => {
  const { buttonStyle, buttonTitle } = styles;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle, style]}
      disable={disabled}
    >
      <Text style={buttonTitle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    backgroundColor: Colors.GRAY,
    borderColor: Colors.GRAY,
    width: Sizes.WINDOW_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    alignSelf: 'center'
  },
});

export { Button };
