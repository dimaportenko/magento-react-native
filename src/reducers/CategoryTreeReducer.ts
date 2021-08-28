import {
  MAGENTO_GET_CATEGORY_TREE,
  MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE,
} from '../actions/types';
import { CategoryType } from '../magento/types';

export type CategoryTreeReducerType = Partial<CategoryType> & {
  refreshing: boolean;
};

const INITIAL_STATE: CategoryTreeReducerType = {
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_GET_CATEGORY_TREE:
      return action.payload;
    case MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE:
      return {
        ...state,
        refreshing: action.payload,
      };
    default:
      return state;
  }
};
