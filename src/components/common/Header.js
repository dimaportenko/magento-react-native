// libraries
import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

// component
const Header = (props) => {
  const { textStyles, viewStyles } = styles;

  return (
    <View style={viewStyles} >
      <Text style={textStyles} >{props.text}</Text>
    </View>
  );
};

const MaterialHeaderButton = props => (
  <HeaderButton
    IconComponent={MaterialIcons}
    iconSize={Sizes.HEADER_BUTTON_SIZE}
    color={Colors.ACCENT_COLOR}
    {...props}
  />
);

const styles = {
  viewStyles: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyles: {
    fontSize: 20
  }
};

export const MaterialHeaderButtons = props => (
  <HeaderButtons
    HeaderButtonComponent={MaterialHeaderButton}
    OverflowIcon={<MaterialIcons name="more-vert" size={Sizes.HEADER_BUTTON_SIZE} color={Colors.ACCENT_COLOR} />}
    {...props}
  />
);

export const { Item } = HeaderButtons;

// share component with app
export { Header };
