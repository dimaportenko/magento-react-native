import { UI_PRODUCT_LIST_TYPE_GRID } from '../actions/types';

const INITIAL_STATE = {
  listTypeGrid: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UI_PRODUCT_LIST_TYPE_GRID:
      return { ...state, listTypeGrid: action.payload };
    default:
      return state;
  }
};
