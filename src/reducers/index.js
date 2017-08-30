 import { combineReducers } from 'redux';
 import MagentoReducer from './MagentoReducer';
 import CategoryTreeReducer from './CategoryTreeReducer';
 import NavigationReducer from './NavigationReducer';
 import CategoryReducer from './CategoryReducer';

 export default combineReducers({
   categoryTree: CategoryTreeReducer,
   category: CategoryReducer,
   magento: MagentoReducer,
   nav: NavigationReducer
 });
