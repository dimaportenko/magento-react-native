import React, { useContext } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../theme';

const CardSection = ({
  children,
  style,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.containerStyles(theme), style]}>
      {children}
    </View>
  );
};

const styles = {
  containerStyles: theme => ({
    borderBottomWidth: 1,
    padding: theme.spacing.tiny,
    backgroundColor: theme.colors.surface,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: theme.colors.border,
    position: 'relative',
  }),
};

CardSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  style: ViewPropTypes.style,
};

CardSection.defaultProps = {
  style: {},
};

export { CardSection };
