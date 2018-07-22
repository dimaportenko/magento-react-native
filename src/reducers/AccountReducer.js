import { MAGENTO_CURRENT_CUSTOMER } from '../actions/types';

const INITIAL_STATE = {
  customer: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_CURRENT_CUSTOMER:
      return { ...state, customer: action.payload };
    default:
      return state;
  }
};
