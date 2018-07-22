import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonStyles } from '../../constants/Styles';
import { logout, currentCustomer } from '../../actions';
import { Spinner } from '../common';

class Account extends Component {
  static navigationOptions = {
    title: 'Account'
  };

  componentWillMount() {
    if (!this.props.customer) {
      this.props.currentCustomer();
    }
  }

  onLogoutPress = () => {
    this.props.logout();
  };

  renderCustomerData() {
    if (!this.props.customer) {
      return <Spinner />;
    }
    
    const { email, firstname, lastname } = this.props.customer;
    return (
      <View>
        <Text>Contact Information</Text>
        <Text>{firstname} {lastname}</Text>
        <Text>{email}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCustomerData()}
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

const mapStateToProps = ({ account }) => {
  const { customer } = account;
  return { customer };
};

export default connect(mapStateToProps, { logout, currentCustomer })(Account);
