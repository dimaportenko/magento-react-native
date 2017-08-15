import {
  MAGENTO_INIT
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_INIT:
      return action.payload;
    default:
      return state;
  }
};
