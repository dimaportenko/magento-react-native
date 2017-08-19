import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ExpandButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 18,
    fontWeight: '600',
		paddingRight: 15,
    paddingLeft: 15
  },
  buttonStyle: {
		alignSelf: 'flex-end',
    marginLeft: 5,
    marginRight: 5
  }
};

export { ExpandButton };
