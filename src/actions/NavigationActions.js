import {
	NAVIGATION_GO_TO_SCREEN,
	NAVIGATION_GO_HOME
} from '../actions/types';

export const goToScreen = ({ routeName, params }) => {
	return {
		type: NAVIGATION_GO_TO_SCREEN,
		payload: { routeName, params }
	};
};

export const goHome = () => {
	return {
		type: NAVIGATION_GO_HOME
	};
};
