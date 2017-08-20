import { NavigationActions } from 'react-navigation';
// import {
// 	NAVIGATION_CATEGORY_TREE,
// 	NAVIGATION_CATEGORY
// } from '../actions/types';


import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('CategoryTree');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Category');
const INITIAL_STATE = AppNavigator.router.getStateForAction(
  firstAction
);

export default (state = INITIAL_STATE, action) => {
  let nextState;
  // debugger;
  switch (action.type) {
    case 'CategoryTree':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'Category':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'CategoryTree' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};
