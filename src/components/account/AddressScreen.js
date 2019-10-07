import React from 'react';
import { View } from 'react-native';
import AddAccountAddress from './AddAccountAddress';

const AddressScreen = () => (
  <View style={{ flex: 1 }}>
    <AddAccountAddress />
  </View>
);

AddressScreen.navigationOptions = () => ({
  title: 'My Address',
  headerBackTitle: ' ',
});

export default AddressScreen;
