import React, { useRef, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner, Button, Text, Input } from '../common';
import { signIn } from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

// This file name should be Signup
const Signin = ({ loading, error, success, signIn: _signIn }) => {
  const theme = useContext(ThemeContext);
  // Internal State
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Reference
  const lastnameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const onCreateAccountPress = () => {
    // TODO: add password validation check
    const customer = {
      customer: {
        email,
        firstname,
        lastname,
      },
      password,
    };
    _signIn(customer);
  };

  const renderButtons = () => {
    if (loading) {
      return <Spinner />;
    }

    return (
      <Button
        disabled={
          firstname === '' || lastname === '' || email === '' || password === ''
        }
        onPress={onCreateAccountPress}>
        {translate('signup.createAccountButton')}
      </Button>
    );
  };

  const renderMessages = () => {
    if (error) {
      return <Text style={styles.error(theme)}>{error}</Text>;
    }

    if (success) {
      return <Text style={styles.success(theme)}>{success}</Text>;
    }
  };

  return (
    <View style={styles.container(theme)}>
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.firstName')}
        returnKeyType="next"
        autoCorrect={false}
        value={firstname}
        editable={!loading}
        onChangeText={setFirstname}
        onSubmitEditing={() => {
          lastnameInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.lastName')}
        autoCorrect={false}
        returnKeyType="next"
        value={lastname}
        editable={!loading}
        onChangeText={setLastname}
        assignRef={input => {
          lastnameInput.current = input;
        }}
        onSubmitEditing={() => {
          emailInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.email')}
        keyboardType="email-address"
        returnKeyType="next"
        autoCorrect={false}
        value={email}
        editable={!loading}
        onChangeText={setEmail}
        assignRef={input => {
          emailInput.current = input;
        }}
        onSubmitEditing={() => {
          passwordInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry
        placeholder={translate('common.password')}
        autoCorrect={false}
        value={password}
        editable={!loading}
        onChangeText={setPassword}
        assignRef={input => {
          passwordInput.current = input;
        }}
        onSubmitEditing={onCreateAccountPress}
        containerStyle={styles.inputContainer(theme)}
      />
      {renderButtons()}
      {renderMessages()}
      <View />
    </View>
  );
};

Signin.navigationOptions = {
  title: translate('signup.title'),
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  }),
  inputContainer: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginBottom: theme.spacing.large,
  }),
  error: theme => ({
    color: theme.colors.error,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  success: theme => ({
    color: theme.colors.success,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.soacing.extraLarge,
  }),
});

Signin.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType(PropTypes.string, null),
  success: PropTypes.oneOfType(PropTypes.string, null),
  signIn: PropTypes.func.isRequired,
};

Signin.defaultProps = {
  error: null,
  success: null,
};

const mapStateToProps = ({ customerAuth }) => {
  const { error, success, loading } = customerAuth;

  return { error, success, loading };
};

export default connect(mapStateToProps, { signIn })(Signin);
