import React, { FC, useContext } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { ThemeContext } from '../../theme';
import { ThemeType } from "../../theme/theme";

const Input: FC<
  {
    label?: string;
    value: string;
    onChangeText?: () => void;
    placeholder: string;
    secureTextEntry?: boolean;
    containerStyle?: ViewStyle;
    labelStyle?: ViewStyle;
    inputStyle?: StyleProp<TextStyle> | undefined;
    assignRef?: (component: TextInput | null) => void;
  } & TextInputProps
> = ({
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
  containerStyle: (theme: ThemeType): ViewStyle => ({
    height: theme.dimens.defaultInputBoxHeight,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  inputStyle: (theme: ThemeType) => ({
    color: theme.colors.titleText,
    padding: theme.spacing.small,
    flex: 2,
  }),
  labelStyle: (theme: ThemeType) => ({
    paddingLeft: theme.spacing.large,
    flex: 1,
  }),
};

export { Input };
