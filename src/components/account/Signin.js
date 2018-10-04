import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import { Spinner } from '../common/Spinner';
import { signIn } from '../../actions';

class Signin extends Component {
  static navigationOptions = {
    title: 'Sign In'
  };

  componentWillMount() {
    this.setState({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }

  onCreateAccountPress = () => {
    const { email, password, firstname, lastname, confirmPassword } = this.state;
    // TODO: add password check

    const customer = {
      customer: {
        email,
        firstname,
        lastname,
      },
      password
    };

    this.props.signIn(customer);
  };

  renderButtons() {
    if (this.props.loading) {
      return <Spinner style={{ marginTop: 30 }} />;
    }

    return (
      <View>
        <TouchableOpacity onPress={this.onCreateAccountPress} style={styles.button}>
          <Text style={styles.buttonTitle}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderMessages() {
    const { error, success } = this.props;
    if (error) {
      return <Text style={styles.error}>{error}</Text>;
    }

    if (success) {
      return <Text style={styles.success}>{success}</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.inputContainer, styles.offsetTop]}>
          <TextInput
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="Firstname"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
            value={this.state.firstname}
            onChangeText={value => this.setState({ firstname: value })}
            onSubmitEditing={() => { this.lastnameInput.focus(); }}
          />
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="Lastname"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
            value={this.state.lastname}
            onChangeText={value => this.setState({ lastname: value })}
            ref={input => { this.lastnameInput = input; }}
            onSubmitEditing={() => { this.emailInput.focus(); }}
          />
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="next"
            autoCorrect={false}
            style={styles.input}
            value={this.state.email}
            onChangeText={value => this.setState({ email: value })}
            ref={input => { this.emailInput = input; }}
            onSubmitEditing={() => { this.passwordInput.focus(); }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            secureTextEntry
            placeholder="Password"
            autoCorrect={false}
            style={styles.input}
            value={this.state.password}
            onChangeText={value => this.setState({ password: value })}
            ref={input => { this.passwordInput = input; }}
            onSubmitEditing={this.onCreateAccountPress}
          />
        </View>
        {this.renderButtons()}
        {this.renderMessages()}
        <View />
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
  input: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAY,
    width: Sizes.WINDOW_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20
  },
  offsetTop: {
    marginTop: Sizes.WINDOW_HEIGHT * 0.1
  },
  button: {
    borderWidth: 1,
    backgroundColor: Colors.BORDER_GRAY,
    borderColor: Colors.BORDER_GRAY,
    width: Sizes.WINDOW_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    alignSelf: 'center'
  },
  error: {
    color: 'red',
    width: Sizes.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20
  },
  success: {
    width: Sizes.WINDOW_WIDTH * 0.85,
    color: '#01640B',
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#E5EFE5',
    padding: 5,
    marginTop: 20
  },
});

const mapStateToProps = ({ customerAuth }) => {
  const { error, success, loading } = customerAuth;

  return { error, success, loading };
};

export default connect(mapStateToProps, { signIn })(Signin);
