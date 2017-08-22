import { NavigationActions } from 'react-navigation';
import {
	NAVIGATION_GO_TO_SCREEN
} from '../actions/types';
import {
	NAVIGATION_CATEGORY_TREE_PATH
} from '../navigators/types';
import { AppNavigator } from '../navigators/AppNavigator';

const categoryTreeAction = AppNavigator.router.getActionForPathAndParams(
    NAVIGATION_CATEGORY_TREE_PATH
);
const INITIAL_STATE = AppNavigator.router.getStateForAction(
		categoryTreeAction
);

export default (state = INITIAL_STATE, action) => {
  let nextState;
  switch (action.type) {
		case NAVIGATION_GO_TO_SCREEN: {
			const { routeName, params } = action.payload;
			nextState = AppNavigator.router.getStateForAction(
					NavigationActions.navigate({ routeName, params }),
					state
			);
			break;
		}
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};
