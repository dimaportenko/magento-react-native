import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common';
import { buttonStyles, inputStyles } from '../../constants/Styles';
import { initiatePasswordReset } from '../../actions';

class PasswordReset extends Component {
  static navigationOptions = {
    title: 'Reset Password'
  };

  componentWillMount() {
    this.setState({
      email: ''
    });
  }

  onResetPress = () => {
    this.props.initiatePasswordReset(this.state.email);
  };

  renderButtons() {
    if (this.props.loading) {
      return <Spinner style={{ marginTop: 30 }} />;
    }

    return (
      <TouchableOpacity onPress={this.onResetPress} style={buttonStyles.button}>
        <Text style={buttonStyles.title}>RESET MY PASSWORD</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.contentTitle1}>PASSWORD RECOVERY</Text>
          <Text style={styles.contentTitle2}>
            Please enter your email address below to receive a password reset
            link
          </Text>
          <View style={[inputStyles.container, styles.emailOffset]}>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              keyboardType="email-address"
              placeholder="Email"
              autoCorrect={false}
              style={inputStyles.input}
              value={this.state.email}
              onSubmitEditing={this.onResetPress}
              onChangeText={email => this.setState({ email })}
            />
          </View>
          {this.renderButtons()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  content: {
    width: 230,
    marginTop: 55,
    alignItems: 'center'
  },
  contentTitle1: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 13
  },
  contentTitle2: {
    fontSize: 12,
    textAlign: 'center'
  },
  emailOffset: {
    marginTop: 18,
    marginBottom: 15
  }
});

const mapStateToProps = ({ customerAuth }) => {
  const { reset_email, reset_loading } = customerAuth;

  return { email: reset_email, loading: reset_loading };
};

export default connect(mapStateToProps, {
  initiatePasswordReset
})(PasswordReset);
