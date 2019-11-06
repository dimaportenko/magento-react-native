import { AppRegistry } from 'react-native';
import App from './src/App';
// import StorybookUIRoot from './storybook';

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
// const SHOW_STORYBOOK = true;
//
// const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App;
// AppRegistry.registerComponent('magento_mobile_app', () => RootComponent);

AppRegistry.registerComponent('magento_mobile_app', () => App);
