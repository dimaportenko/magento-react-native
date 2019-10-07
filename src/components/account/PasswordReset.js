import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Spinner,
  Button,
  Text,
  Input,
} from '../common';
import { initiatePasswordReset, updatePasswordResetUI } from '../../actions';
import { ThemeContext } from '../../theme';

const PasswordReset = ({
  loading,
  error,
  success,
  initiatePasswordReset: _initiatePasswordReset,
  updatePasswordResetUI: _updatePasswordResetUI,
}) => {
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  useEffect(() => (() => {
    // componentWillUnmount
    _updatePasswordResetUI();
  }), []);

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
      <Button
        disabled={email === ''}
        onPress={onResetPress}
      >
        RESET MY PASSWORD
      </Button>
    );
  };

  return (
    <View style={styles.container(theme)}>
      <Text type="subheading" bold style={styles.title(theme)}>PASSWORD RECOVERY</Text>
      <Text style={styles.description}>
        Please enter your email address below to receive a password reset
        link
      </Text>
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        keyboardType="email-address"
        placeholder="Email"
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

PasswordReset.navigationOptions = {
  title: 'Reset Password',
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  }),
  title: theme => ({
    marginBottom: theme.spacing.medium,
  }),
  description: {
    textAlign: 'center',
  },
  emailOffset: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginVertical: theme.spacing.large,
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
    marginTop: theme.spacing.extraLarge,
  }),
});

PasswordReset.propTypes = {
  loading: PropTypes.bool.isRequired,
  success: PropTypes.oneOfType([PropTypes.string, null]),
  error: PropTypes.oneOfType([PropTypes.string, null]),
  initiatePasswordReset: PropTypes.func.isRequired,
  updatePasswordResetUI: PropTypes.func.isRequired,

};

PasswordReset.defaultProps = {
  success: null,
  error: null,
};

const mapStateToProps = ({ customerAuth }) => {
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

export default connect(mapStateToProps, {
  initiatePasswordReset,
  updatePasswordResetUI,
})(PasswordReset);
