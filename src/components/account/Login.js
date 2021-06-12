import React, { useState, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner, Button, Input, Text } from '../common';
import { auth } from '../../actions/CustomerAuthActions';
import {
  NAVIGATION_SIGNIN_PATH,
  NAVIGATION_RESET_PASSWORD_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

const Login = ({ loading, error, success, navigation, auth: _auth }) => {
  const theme = useContext(ThemeContext);
  // Internal State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Reference
  const passwordInput = useRef();

  const onLoginPress = () => {
    _auth(email, password);
  };

  const onSigninPress = () => {
    navigation.navigate(NAVIGATION_SIGNIN_PATH);
  };

  const passwordForget = () => {
    navigation.navigate(NAVIGATION_RESET_PASSWORD_PATH);
  };

  const renderButtons = () => {
    if (loading) {
      return <Spinner style={{ marginTop: 30 }} />;
    }

    return (
      <View>
        <Button
          disabled={email === '' || password === ''}
          onPress={onLoginPress}>
          {translate('login.loginButton')}
        </Button>
        <Button onPress={onSigninPress} style={styles.buttonMargin(theme)}>
          {translate('login.signupButton')}
        </Button>
        <TouchableOpacity onPress={passwordForget} style={styles.link(theme)}>
          <Text style={styles.linkTitle}>
            {translate('login.forgetPassword')}
          </Text>
        </TouchableOpacity>
      </View>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container(theme)}>
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
        onSubmitEditing={() => passwordInput.current.focus()}
        containerStyle={styles.inputContainer(theme)}
        textContentType="emailAddress"
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
        onSubmitEditing={onLoginPress}
        assignRef={input => {
          passwordInput.current = input;
        }}
        containerStyle={styles.inputContainer(theme)}
        textContentType="password"
      />
      {renderButtons()}
      {renderMessages()}
    </KeyboardAvoidingView>
  );
};

Login.navigationOptions = {
  title: translate('login.title'),
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
  buttonMargin: theme => ({
    marginTop: theme.spacing.large,
  }),
  error: theme => ({
    color: theme.colors.error,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  }),
  success: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  link: theme => ({
    marginTop: theme.spacing.extraLarge,
  }),
  linkTitle: {
    textAlign: 'center',
  },
});

const mapStateToProps = ({ customerAuth }) => {
  const { error, success, loading } = customerAuth;

  return { error, success, loading };
};

Login.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType(PropTypes.string, null),
  success: PropTypes.oneOfType(PropTypes.string, null),
  auth: PropTypes.func.isRequired,
};

Login.defaultProps = {
  error: null,
  success: null,
  loading: false,
};

export default connect(mapStateToProps, { auth })(Login);
