import {
  ADD_FILTER_DATA,
  RESET_FILTERS_DATA,
} from '../actions/types';

const INITIAL_STATE = {
  priceFilter: null,
  sortOrder: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FILTER_DATA: {
      if (typeof action.payload === 'number') {
        return { ...state, sortOrder: action.payload };
      }
        return { ...state, priceFilter: action.payload };
    }
    case RESET_FILTERS_DATA:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
