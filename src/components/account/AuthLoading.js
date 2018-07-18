import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StatusBar, StyleSheet, AsyncStorage } from 'react-native';
import { Spinner } from './../common';
import {
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_AUTH_STACK_PATH
} from '../../navigation/routes';
import { magento } from '../../magento';
import { orderProducts, errorMessage, customerUpdate } from '../../actions';

class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      magento.setCustomerToken(customerToken);

      if (customerToken) {
        const customer = await magento.customer.getCurrentCustomer();
      }

      this.props.navigation.navigate(
        customerToken
          ? NAVIGATION_ACCOUNT_STACK_PATH
          : NAVIGATION_AUTH_STACK_PATH
      );
    } catch (e) {
      // TODO: add error screen via switch navigation
      this.props.navigation.navigate(NAVIGATION_AUTH_STACK_PATH);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    flexDirection: 'column'
  }
});

export default connect(null, { orderProducts, errorMessage, customerUpdate })(
  AuthLoading
);
