import React, { FC, useContext, useMemo } from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { ThemeContext } from '../../theme';
import { ThemeType } from '../../theme/theme';

// Possible value for prop "type" for Text
const HEADING = 'heading';
const SUB_HEADING = 'subheading';
const BODY = 'body';
const LABEL = 'label';
const CAPTION = 'caption';

type TextType =
  | typeof HEADING
  | typeof SUB_HEADING
  | typeof BODY
  | typeof LABEL
  | typeof CAPTION;

const Text: FC<
  TextProps & {
    type?: TextType;
    bold?: boolean;
  }
> = ({
  /**
   * @type prop helps style Text with pre default styling define in
   * typography.js. Possible value of type can be:
   * 1. 'heading'
   * 2. 'subheading'
   * 3. 'body'
   * 4. 'label'
   * 5. 'caption'
   *
   * default value: 'body'
   */
  type = BODY,
  /**
   * @bold prop is a boolean, if enabled will use bold version of the
   * type mentioned.
   */
  bold = false,
  /**
   * @style prop will overwrite the predefined styling for Text defined by
   * @type prop
   *
   * default value: false
   */
  style,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const textStyle = useMemo(
    () => getTextStyle(type, bold, theme),
    [type, bold, theme],
  );
  return <RNText style={[textStyle, style]} {...props} />;
};

type TypographyKeyType = keyof ThemeType['typography'];

const getTextStyle = (type: TextType, bold: boolean, theme: ThemeType) => {
  let style: TypographyKeyType;
  switch (type) {
    case HEADING:
      style = 'headingText';
      break;
    case SUB_HEADING:
      style = 'subheadingText';
      break;
    case LABEL:
      style = 'labelText';
      break;
    case CAPTION:
      style = 'captionText';
      break;
    default:
      style = 'bodyText';
  }
  if (bold) {
    style = `${style}Bold`;
  }
  return theme.typography[style];
};

export { Text };
