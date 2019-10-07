import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CheckoutSection from './CheckoutSection';
import CheckoutCustomerAccount from './CheckoutCustomerAccount';
import CheckoutShippingMethod from './CheckoutShippingMethod';
import CheckoutPaymentMethod from './CheckoutPaymentMethod';
import CheckoutTotals from './CheckoutTotals';
import { ThemeContext } from '../../theme';

const Checkout = ({
  navigation,
  activeSection: _activeSection,
}) => {
  const theme = useContext(ThemeContext);
  const activeSection = Number(_activeSection);

  return (
    <ScrollView style={styles.container(theme)}>
      <CheckoutSection title="Customer Account" number="1" expanded={activeSection === 1}>
        <CheckoutCustomerAccount />
      </CheckoutSection>
      <CheckoutSection title="Shipping Method" number="2" expanded={activeSection === 2}>
        <CheckoutShippingMethod />
      </CheckoutSection>
      <CheckoutSection title="Payment Method" number="3" expanded={activeSection === 3}>
        <CheckoutPaymentMethod />
      </CheckoutSection>
      <CheckoutSection title="Summary" number="4" expanded={activeSection === 4}>
        <CheckoutTotals navigation={navigation} />
      </CheckoutSection>
    </ScrollView>
  );
};

Checkout.navigationOptions = {
  title: 'Checkout',
  headerBackTitle: ' ',
};

const styles = {
  container: theme => ({
    backgroundColor: theme.colors.background,
    flex: 1,
  }),
};

const mapStateToProps = ({ checkout }) => {
  const { activeSection } = checkout;

  return {
    activeSection,
  };
};

export default connect(mapStateToProps)(Checkout);
