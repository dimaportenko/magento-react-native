import React, { useState } from 'react';
import { View, ViewPropTypes } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import PropTypes from 'prop-types';
import { Input } from './Input';

const ModalSelect = ({ data, disabled, label, onChange, attribute, style }) => {
  const [value, setValue] = useState('');

  const _onChange = option => {
    setValue(
      attribute === 'CurrencyCode'
        ? option.label
        : `${label} : ${option.label}`,
    );

    if (onChange) {
      onChange(attribute, option.key);
    }
  };

  return (
    <View style={style}>
      <ModalSelector
        disabled={disabled}
        data={data}
        initValue={label}
        onChange={_onChange}>
        <Input
          inputStyle={styles.inputStyle}
          editable={false}
          placeholder={label}
          value={value}
        />
      </ModalSelector>
    </View>
  );
};

// TODO: add style for disabled element
const styles = {
  inputStyle: {
    textAlign: 'center',
  },
};

ModalSelect.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
  label: PropTypes.string.isRequired,
  attribute: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

ModalSelect.defaultProps = {
  disabled: false,
  onChange: null,
  attribute: '',
  style: {},
};

export { ModalSelect };
