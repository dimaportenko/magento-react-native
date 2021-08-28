import { ADD_FILTER_DATA, RESET_FILTERS_DATA } from '../actions/types';

export type PriceFilterType = {
  price: {
    condition: string;
    value: string;
  };
};

export type FilterReducerType = {
  priceFilter?: PriceFilterType;
  sortOrder?: number;
  categoryScreen?: boolean;
};

const INITIAL_STATE: FilterReducerType = {
  priceFilter: undefined,
  sortOrder: undefined,
  categoryScreen: undefined,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FILTER_DATA: {
      if (typeof action.payload === 'number') {
        return { ...state, sortOrder: action.payload };
      }
      if (action.payload.price) {
        return { ...state, priceFilter: action.payload };
      }
      return { ...state, categoryScreen: true };
    }
    case RESET_FILTERS_DATA:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
