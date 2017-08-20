 import { combineReducers } from 'redux';
 import MagentoReducer from './MagentoReducer';
 import CategoryTreeReducer from './CategoryTreeReducer';
 import NavigationReducer from './NavigationReducer';

 export default combineReducers({
   magento: MagentoReducer,
   categoryTree: CategoryTreeReducer,
   nav: NavigationReducer
 });
