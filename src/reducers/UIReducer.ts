import { UI_PRODUCT_LIST_TYPE_GRID } from '../actions/types';
import { uiProductListTypeGrid } from '../actions';

export type UIReducerType = {
  listTypeGrid: boolean;
};

const INITIAL_STATE: UIReducerType = {
  listTypeGrid: true,
};

type Actions = ReturnType<typeof uiProductListTypeGrid>;

const reducer = (state = INITIAL_STATE, action: Actions) => {
  switch (action.type) {
    case UI_PRODUCT_LIST_TYPE_GRID:
      return { ...state, listTypeGrid: action.payload };
    default:
      return state;
  }
};

export default reducer;
