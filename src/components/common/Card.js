import React, { useContext } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../theme';

const Card = ({
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
    borderWidth: 1,
    borderRadius: theme.dimens.borderRadius,
    borderColor: theme.colors.border,
    borderBottomWidth: 0,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: theme.spacing.tiny,
    marginRight: theme.spacing.tiny,
    marginTop: theme.spacing.small,
  }),
};

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  style: ViewPropTypes.style,
};

Card.defaultProps = {
  style: {},
};

export { Card };
