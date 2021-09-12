import React, { ReactElement } from 'react';

import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  MainViewStyle?: ViewStyle;
  IconBadgeStyle?: ViewStyle;
  MainElement?: ReactElement;
  BadgeElement?: ReactElement;
  Hidden?: boolean;
};

export class IconBadge extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          style.MainView,
          this.props.MainViewStyle ? this.props.MainViewStyle : {},
        ]}>
        {
          // main element
          this.props.MainElement
        }
        {!this.props.Hidden && (
          <View
            style={[
              style.IconBadge,
              this.props.IconBadgeStyle ? this.props.IconBadgeStyle : {},
            ]}>
            {
              // badge element
              this.props.BadgeElement
            }
          </View>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create({
  IconBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    minWidth: 20,
    height: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
  },
  MainView: {},
});
