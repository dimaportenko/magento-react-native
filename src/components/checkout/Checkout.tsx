import React, { FC, useContext } from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import CheckoutSection from './CheckoutSection';
import CheckoutCustomerAccount from './CheckoutCustomerAccount';
import CheckoutShippingMethod from './CheckoutShippingMethod';
import CheckoutPaymentMethod from './CheckoutPaymentMethod';
import CheckoutTotals from './CheckoutTotals';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const Checkout: FC<{
  navigation: any;
}> = ({ navigation }) => {
  const theme = useContext(ThemeContext);

  const activeSection = useSelector(
    (state: StoreStateType) => state.checkout.activeSection,
  );

  return (
    <ScrollView style={styles.container(theme)}>
      <CheckoutSection
        title={translate('checkout.customerAccount')}
        number="1"
        expanded={activeSection === 1}>
        <CheckoutCustomerAccount />
      </CheckoutSection>
      <CheckoutSection
        title={translate('checkout.shippingMethod')}
        number="2"
        expanded={activeSection === 2}>
        <CheckoutShippingMethod />
      </CheckoutSection>
      <CheckoutSection
        title={translate('checkout.paymentMethod')}
        number="3"
        expanded={activeSection === 3}>
        <CheckoutPaymentMethod />
      </CheckoutSection>
      <CheckoutSection
        title={translate('checkout.summary')}
        number="4"
        expanded={activeSection === 4}>
        <CheckoutTotals navigation={navigation} />
      </CheckoutSection>
    </ScrollView>
  );
};

// @ts-ignore
Checkout.navigationOptions = {
  title: translate('checkout.title'),
  headerBackTitle: ' ',
};

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    backgroundColor: theme.colors.background,
    flex: 1,
  }),
};

export default Checkout;
