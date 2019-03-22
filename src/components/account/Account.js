import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Button } from '../common';
import { logout, currentCustomer } from '../../actions';
import { NAVIGATION_ORDER_PRODUCT_PATH } from '../../navigation/routes';

class Account extends Component {
  static navigationOptions = {
    title: 'Account'
  };

  componentDidMount() {
    if (!this.props.customer) {
      this.props.currentCustomer();
    }
  }

  onLogoutPress = () => {
    this.props.logout();
  };

  renderCustomerData() {
    if (!this.props.customer) {
      return <ActivityIndicator size="large" style={styles.activity} />;
    }

    const { email, firstname, lastname } = this.props.customer;
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Contact Information</Text>
        <Text style={styles.text}>
          {firstname} {lastname}
        </Text>
        <Text style={styles.text}>{email}</Text>
      </View>
    );
  }

  renderOrderList = () => {
    this.props.navigation.navigate(NAVIGATION_ORDER_PRODUCT_PATH);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCustomerData()}
        <Button onPress={this.onLogoutPress}>
          LOG OUT
        </Button>
        <Button onPress={this.renderOrderList} style={styles.buttonMargin}>
          My Orders
        </Button>
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
  },
  activity: {
    padding: 10
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  },
  textContainer: {
    marginBottom: 15
  },
  buttonMargin: {
    marginTop: 20
  },
});

const mapStateToProps = ({ account }) => {
  const { customer } = account;
  return { customer };
};

export default connect(mapStateToProps, { logout, currentCustomer })(Account);
