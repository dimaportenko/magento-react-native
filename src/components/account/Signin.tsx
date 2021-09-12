import React, { useRef, useState, useContext, FC } from 'react';
import { View, TextInput, TextStyle, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Spinner, Button, Text, Input } from '../common';
import { signIn } from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { ThemeType } from '../../theme/theme';
import { StoreStateType } from '../../reducers';

const mapStateToProps = ({ customerAuth }: StoreStateType) => {
  const { error, success, loading } = customerAuth;

  return { error, success, loading };
};

const connector = connect(mapStateToProps, { signIn });

type PropsFromRedux = ConnectedProps<typeof connector>;

// This file name should be Signup
const Signin: FC<PropsFromRedux> = ({
  loading,
  error,
  success,
  signIn: _signIn,
}) => {
  const theme = useContext(ThemeContext);
  // Internal State
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Reference
  const lastnameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);

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
          lastnameInput.current?.focus();
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
        ref={lastnameInput}
        onSubmitEditing={() => {
          emailInput.current?.focus();
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
        ref={emailInput}
        onSubmitEditing={() => {
          passwordInput.current?.focus();
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
        ref={passwordInput}
        onSubmitEditing={onCreateAccountPress}
        containerStyle={styles.inputContainer(theme)}
      />
      {renderButtons()}
      {renderMessages()}
      <View />
    </View>
  );
};

// @ts-ignore
Signin.navigationOptions = {
  title: translate('signup.title'),
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
  error: (theme: ThemeType): TextStyle => ({
    color: theme.colors.error,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  success: (theme: ThemeType): TextStyle => ({
    color: theme.colors.success,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
};
export default connector(Signin);
