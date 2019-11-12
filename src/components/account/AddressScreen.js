import React from 'react';
import { View } from 'react-native';
import AddAccountAddress from './AddAccountAddress';
import { translate } from '../../i18n';

const AddressScreen = () => (
  <View style={{ flex: 1 }}>
    <AddAccountAddress />
  </View>
);

AddressScreen.navigationOptions = () => ({
  title: translate('addAccountAddress.title'),
  headerBackTitle: ' ',
});

export default AddressScreen;
