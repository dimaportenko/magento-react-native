 import { combineReducers } from 'redux';
 import MagentoReducer from './MagentoReducer';
 import CategoryTreeReducer from './CategoryTreeReducer';

 export default combineReducers({
   magento: MagentoReducer,
   categoryTree: CategoryTreeReducer
 });
