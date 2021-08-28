import React, { FC, useContext } from 'react';
import { TextInput, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { ThemeContext } from '../../theme';

const Input: FC<{
  label: string;
  value: string;
  onChangeText: () => void;
  placeholder: string;
  secureTextEntry: boolean;
  containerStyle: ViewStyle;
  labelStyle: ViewStyle;
  inputStyle: ViewStyle;
  assignRef: (component: TextInput | null) => void;
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  assignRef,
  containerStyle,
  labelStyle,
  inputStyle,
  ...props
}) => {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.containerStyle(theme), containerStyle]}>
      {label && (
        <Text type="heading" style={[styles.labelStyle(theme), labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.bodyText}
        autoCorrect={false}
        style={[styles.inputStyle(theme), inputStyle]}
        value={value}
        onChangeText={onChangeText}
        ref={component => {
          assignRef && assignRef(component);
        }}
      />
    </View>
  );
};

const styles = {
  containerStyle: theme => ({
    height: theme.dimens.defaultInputBoxHeight,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  inputStyle: theme => ({
    color: theme.colors.titleText,
    padding: theme.spacing.small,
    flex: 2,
  }),
  labelStyle: theme => ({
    paddingLeft: theme.spacing.large,
    flex: 1,
  }),
};

export { Input };
