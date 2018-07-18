import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Account extends Component {
  static navigationOptions = {
    title: 'Account'
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Account</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  }
});

export default Account;
