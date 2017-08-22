import {
	MAGENTO_CURRENT_CATEGORY
} from '../actions/types';

const INITIAL_STATE = {
  current: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CATEGORY:
      return { ...state, current: action.payload };
    default:
      return state;
  }
};
