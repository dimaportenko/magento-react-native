import { StyleSheet } from 'react-native';
import Sizes from './Sizes';
import Colors from './Colors';
import Fonts from './Fonts';

export const buttonStyles = StyleSheet.create({
  button: {
    borderWidth: 1,
    backgroundColor: Colors.BORDER_GRAY,
    borderColor: Colors.BORDER_GRAY,
    width: Sizes.WINDOW_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    alignSelf: 'center'
  }
});

export const inputStyles = StyleSheet.create({
  input: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5
  },
  container: {
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAY,
    width: Sizes.WINDOW_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20
  },
});
