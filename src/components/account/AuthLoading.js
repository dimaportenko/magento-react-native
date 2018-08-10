import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StatusBar, StyleSheet, AsyncStorage } from 'react-native';
import { Spinner } from './../common';
import {
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH
} from '../../navigation/routes';
import { magento } from '../../magento';


class AuthLoading extends Component {
  constructor() {
    super();
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      magento.setCustomerToken(customerToken);

      this.props.navigation.navigate(
        customerToken
          ? NAVIGATION_ACCOUNT_STACK_PATH
          : NAVIGATION_LOGIN_STACK_PATH
      );
    } catch (e) {
      // TODO: add error screen via switch navigation
      this.props.navigation.navigate(NAVIGATION_LOGIN_STACK_PATH);
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

export default connect()(AuthLoading);
