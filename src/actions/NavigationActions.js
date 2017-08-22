import {
	NAVIGATION_GO_TO_SCREEN
} from '../actions/types';

export const goToScreen = ({ routeName, params }) => {
	return {
		type: NAVIGATION_GO_TO_SCREEN,
		payload: { routeName, params }
	};
};
