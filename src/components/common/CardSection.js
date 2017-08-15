import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => (
  <View style={[styles.containerStyles, props.style]}>
    {props.children}
  </View>
);

const styles = {
  containerStyles: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export { CardSection };
