import {
  MAGENTO_GET_CATEGORY_TREE
} from '../actions/types';

const INITIAL_STATE = false;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_GET_CATEGORY_TREE:
      return action.payload;
    default:
      return state;
  }
};
