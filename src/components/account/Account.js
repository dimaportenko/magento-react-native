import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonStyles } from '../../constants/Styles';
import { logout } from '../../actions';

class Account extends Component {
  static navigationOptions = {
    title: 'Account'
  };

  onLogoutPress = () => {
    this.props.logout();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onLogoutPress}
          style={buttonStyles.button}
        >
          <Text style={buttonStyles.title}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20
  }
});

export default connect(null, { logout })(Account);
