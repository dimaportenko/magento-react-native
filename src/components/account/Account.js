import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { buttonStyles } from '../../constants/Styles';
import { logout, currentCustomer } from '../../actions';

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
  }
});

const mapStateToProps = ({ account }) => {
  const { customer } = account;
  return { customer };
};

export default connect(mapStateToProps, { logout, currentCustomer })(Account);
