import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default {
  WINDOW_WIDTH: screenWidth,
  WINDOW_HEIGHT: screenHeight
};
