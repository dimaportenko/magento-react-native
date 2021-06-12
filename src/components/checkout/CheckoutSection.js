import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Text } from '../common';
import { checkoutSetActiveSection } from '../../actions';
import { ThemeContext } from '../../theme';

const CheckoutSection = ({
  number,
  expanded,
  children,
  title,
  checkoutSetActiveSection: _checkoutSetActiveSection,
}) => {
  const theme = useContext(ThemeContext);

  const onPress = () => {
    console.log('Checkout section press');
    console.log(number);
    _checkoutSetActiveSection(number);
  };

  const renderExpanded = () => {
    if (expanded) {
      return <View style={styles.expandedStyle}>{children}</View>;
    }
    return <></>;
  };

  const container = expanded ? styles.containerStyles : {};
  return (
    <View style={container}>
      <TouchableOpacity style={styles.headerStyles(theme)} onPress={onPress}>
        <Text style={styles.leftText}>{title}</Text>
        <View style={styles.textBackground}>
          <Text style={styles.textStyle}>{number}</Text>
        </View>
      </TouchableOpacity>
      {renderExpanded()}
    </View>
  );
};

const styles = {
  containerStyles: {
    flex: 1,
  },
  headerStyles: theme => ({
    opacity: 1,
    borderBottomWidth: 1,
    height: theme.dimens.checkouSectionHeaderHeight,
    borderColor: theme.colors.border,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing.small,
    marginBottom: theme.spacing.tiny,
    backgroundColor: theme.colors.white,
  }),
  textBackground: {
    backgroundColor: '#999',
    height: 40,
    width: 40,
    borderRadius: 40,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftText: {
    fontSize: 18,
  },
  textStyle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  expandedStyle: {
    flex: 1,
  },
};

export default connect(null, { checkoutSetActiveSection })(CheckoutSection);
