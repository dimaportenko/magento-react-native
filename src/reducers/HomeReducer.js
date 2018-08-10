import { HOME_SCREEN_DATA } from '../actions/types';

const INITIAL_STATE = {
  slider: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_SCREEN_DATA:
      return { ...action.payload };
    default:
      return state;
  }
};
