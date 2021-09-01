import React, { FC, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { Text } from '../common';
import { checkoutSetActiveSection } from '../../actions';
import { ThemeContext } from '../../theme';
import { ThemeType } from '../../theme/theme';

const CheckoutSection: FC<{
  number: string;
  expanded: boolean;
  title: string;
}> = ({ number, expanded, children, title }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const onPress = () => {
    console.log('Checkout section press');
    console.log(number);
    dispatch(checkoutSetActiveSection(number));
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
      <TouchableOpacity style={headerStyles(theme)} onPress={onPress}>
        <Text style={styles.leftText}>{title}</Text>
        <View style={styles.textBackground}>
          <Text style={styles.textStyle}>{number}</Text>
        </View>
      </TouchableOpacity>
      {renderExpanded()}
    </View>
  );
};

const headerStyles = (theme: ThemeType): ViewStyle => ({
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
});

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
  },
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
});

export default CheckoutSection;
