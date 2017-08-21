import { NavigationActions } from 'react-navigation';
import {
	NAVIGATION_CATEGORY
} from '../actions/types';
import {
	NAVIGATION_CATEGORY_TREE_PATH,
	NAVIGATION_CATEGORY_PATH
} from '../navigators/types';


import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const categoryTreeAction = AppNavigator.router.getActionForPathAndParams(
    NAVIGATION_CATEGORY_TREE_PATH
);
// const categoryTreeNavState = AppNavigator.router.getStateForAction(categoryTreeAction);
// const categoryAction = AppNavigator.router.getActionForPathAndParams(NAVIGATION_CATEGORY_PATH);
const INITIAL_STATE = AppNavigator.router.getStateForAction(
		categoryTreeAction
);

export default (state = INITIAL_STATE, action) => {
  let nextState;
  // debugger;
  switch (action.type) {
    case NAVIGATION_CATEGORY:
      nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate(
              { routeName: NAVIGATION_CATEGORY_PATH, params: { title: action.payload } }
            ),
            state
          );
      break;
    case 'Category':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Category' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};
