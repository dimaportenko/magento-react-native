import React, { useState, useContext, useRef, FC } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextStyle,
  ViewStyle,
  TextInput,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Spinner, Button, Input, Text } from '../common';
import { auth } from '../../actions/CustomerAuthActions';
import {
  NAVIGATION_SIGNIN_PATH,
  NAVIGATION_RESET_PASSWORD_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({
  customerAuth,
}: {
  customerAuth: {
    loading: boolean;
    error?: string;
    success?: string;
  };
}) => {
  const { error, success, loading } = customerAuth;

  return { error, success, loading };
};

const connector = connect(mapStateToProps, { auth });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const Login: FC<Props> = ({
  loading,
  error,
  success,
  navigation,
  auth: _auth,
}) => {
  const theme = useContext(ThemeContext);
  // Internal State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Reference
  const passwordInput = useRef<TextInput>(null);

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
          <Text style={sh.linkTitle}>{translate('login.forgetPassword')}</Text>
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        onSubmitEditing={() => passwordInput.current?.focus()}
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
        ref={passwordInput}
        containerStyle={styles.inputContainer(theme)}
        textContentType="password"
      />
      {renderButtons()}
      {renderMessages()}
    </KeyboardAvoidingView>
  );
};

// @ts-ignore
Login.navigationOptions = {
  title: translate('login.title'),
};

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  }),
  inputContainer: (theme: ThemeType) => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginBottom: theme.spacing.large,
  }),
  buttonMargin: (theme: ThemeType) => ({
    marginTop: theme.spacing.large,
  }),
  error: (theme: ThemeType): TextStyle => ({
    color: theme.colors.error,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  }),
  success: (theme: ThemeType): TextStyle => ({
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  link: (theme: ThemeType) => ({
    marginTop: theme.spacing.extraLarge,
  }),
};

const sh = StyleSheet.create({
  linkTitle: {
    textAlign: 'center',
  },
});

export default connector(Login);
