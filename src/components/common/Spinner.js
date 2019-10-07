import React, { useContext } from 'react';
import { View, ViewPropTypes, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../theme';

const Spinner = ({
  size,
  style,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.spinnerStyle, style]}>
      <ActivityIndicator
        size={size}
        color={theme.colors.secondary}
      />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['large', 'small']),
  style: ViewPropTypes.style,
};

Spinner.defaultProps = {
  size: 'large',
  style: {},
};

export { Spinner };
