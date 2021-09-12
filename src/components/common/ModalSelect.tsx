import React, { FC, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { Input } from './Input';

const ModalSelect: FC<{
  data: {
    key: string;
    label: string;
  }[];
  label: string;
  attribute: string;
  onChange: (attribute: string, optionKey: string) => void;
  disabled: boolean;
  withLabel?: boolean;
  style?: ViewStyle;
}> = ({
  data,
  disabled = false,
  label,
  onChange,
  attribute,
  style,
  withLabel = true,
}) => {
  const [value, setValue] = useState('');

  const _onChange = (option: { key: string; label: string }) => {
    setValue(!withLabel ? option.label : `${label} : ${option.label}`);

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
const styles = StyleSheet.create({
  inputStyle: {
    textAlign: 'center',
  },
});

export { ModalSelect };
