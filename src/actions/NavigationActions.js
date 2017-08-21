import {
	NAVIGATION_CATEGORY
} from '../actions/types';

export const goToCategory = payload => {
	return {
		type: NAVIGATION_CATEGORY,
		payload
	};
};

