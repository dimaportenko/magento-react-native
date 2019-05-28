import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import AddAccountAddress from "./AddAccountAddress";

class AddressScreen extends Component {
  static navigationOptions = () => ({
    title: 'My Address',
    headerBackTitle: ' '
  });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AddAccountAddress />
      </View>
    );
  }
}

export default AddressScreen;
