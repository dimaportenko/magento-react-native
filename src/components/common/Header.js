// libraries
import React from 'react';
import { Text, View } from 'react-native';

// component
const Header = (props) => {
  const { textStyles, viewStyles } = styles;

  return (
    <View style={viewStyles} >
      <Text style={textStyles} >{props.text}</Text>
    </View>
  );
};

const styles = {
  viewStyles: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyles: {
    fontSize: 20
  }
};

// share component with app
export { Header };
