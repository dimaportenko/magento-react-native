import React, { useEffect, useContext, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Button, Text } from '../common';
import { logout, currentCustomer } from '../../actions';
import {
  NAVIGATION_ORDERS_PATH,
  NAVIGATION_ADDRESS_SCREEN_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ account }: StoreStateType) => {
  const { customer } = account;
  return { customer };
};

const connector = connect(mapStateToProps, { logout, currentCustomer });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const Account: FC<Props> = ({
  customer = null,
  navigation,
  currentCustomer: _currentCustomer,
  logout: _logout,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    // ComponentDidMount
    if (!customer) {
      _currentCustomer();
    }
  }, [_currentCustomer, customer]);

  const onLogoutPress = () => {
    _logout();
  };

  const renderCustomerData = () => {
    if (!customer) {
      return (
        <ActivityIndicator
          size="large"
          color={theme.colors.secondary}
          style={styles.activity(theme)}
        />
      );
    }

    const { email, firstname, lastname } = customer;
    return (
      <View style={styles.textContainer(theme)}>
        <Text bold type="subheading" style={sh.center}>
          {translate('account.contactInformation')}
        </Text>
        <Text style={sh.center}>
          {firstname} {lastname}
        </Text>
        <Text style={sh.center}>{email}</Text>
      </View>
    );
  };

  const openOrders = () => {
    navigation.navigate(NAVIGATION_ORDERS_PATH);
  };

  const openAddAddress = () => {
    navigation.navigate(NAVIGATION_ADDRESS_SCREEN_PATH);
  };

  return (
    <View style={styles.container(theme)}>
      {renderCustomerData()}
      <Button onPress={onLogoutPress}>
        {translate('account.logoutButton')}
      </Button>
      <Button onPress={openOrders} style={styles.buttonMargin(theme)}>
        {translate('account.myOrdersButton')}
      </Button>
      <Button onPress={openAddAddress} style={styles.buttonMargin(theme)}>
        {translate('account.myAddressButton')}
      </Button>
    </View>
  );
};

// @ts-ignore
Account.navigationOptions = {
  title: translate('account.title'),
};

const sh = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.spacing.large,
  }),
  activity: (theme: ThemeType) => ({
    padding: theme.spacing.large,
  }),
  textContainer: (theme: ThemeType) => ({
    marginBottom: theme.spacing.large,
  }),
  buttonMargin: (theme: ThemeType) => ({
    marginTop: theme.spacing.large,
  }),
};

export default connector(Account);
