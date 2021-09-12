import React, { useState, useContext, useEffect, FC } from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Spinner, Button, Text, Input } from '../common';
import { initiatePasswordReset, updatePasswordResetUI } from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ customerAuth }: StoreStateType) => {
  const {
    resetLoading: loading,
    resetPasswordErrorMessage: error,
    resetPasswordSuccessMessage: success,
  } = customerAuth;

  return {
    loading,
    success,
    error,
  };
};

const connector = connect(mapStateToProps, {
  initiatePasswordReset,
  updatePasswordResetUI,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

const PasswordReset: FC<PropsFromRedux> = ({
  loading,
  error,
  success,
  initiatePasswordReset: _initiatePasswordReset,
  updatePasswordResetUI: _updatePasswordResetUI,
}) => {
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  useEffect(
    () => () => {
      // componentWillUnmount
      _updatePasswordResetUI();
    },
    [_updatePasswordResetUI],
  );

  const onResetPress = () => {
    _initiatePasswordReset(email);
  };

  const renderMessages = () => {
    if (error) {
      return <Text style={styles.error(theme)}>{error}</Text>;
    }

    if (success) {
      return <Text style={styles.success(theme)}>{success}</Text>;
    }
  };

  const renderButtons = () => {
    if (loading) {
      return <Spinner style={{ marginTop: theme.spacing.extraLarge }} />;
    }

    return (
      <Button disabled={email === ''} onPress={onResetPress}>
        {translate('passwordReset.resetButton')}
      </Button>
    );
  };

  return (
    <View style={styles.container(theme)}>
      <Text bold type="subheading" style={styles.title(theme)}>
        {translate('passwordReset.passwordRecovery')}
      </Text>
      <Text style={sh.description}>
        {translate('passwordReset.passwordRecoveryInstructions')}
      </Text>
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        keyboardType="email-address"
        placeholder={translate('common.email')}
        autoCorrect={false}
        containerStyle={styles.emailOffset(theme)}
        value={email}
        editable={!loading}
        onSubmitEditing={onResetPress}
        onChangeText={setEmail}
      />
      {renderButtons()}
      {renderMessages()}
    </View>
  );
};

// @ts-ignore
PasswordReset.navigationOptions = {
  title: translate('passwordReset.title'),
};

const sh = StyleSheet.create({
  description: {
    textAlign: 'center',
  },
});

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  }),
  title: (theme: ThemeType) => ({
    marginBottom: theme.spacing.medium,
  }),
  emailOffset: (theme: ThemeType) => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginVertical: theme.spacing.large,
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

export default connector(PasswordReset);
