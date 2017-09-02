 import { combineReducers } from 'redux';
 import MagentoReducer from './MagentoReducer';
 import CategoryTreeReducer from './CategoryTreeReducer';
 import NavigationReducer from './NavigationReducer';
 import CategoryReducer from './CategoryReducer';
 import ProductReducer from './ProductReducer';

 export default combineReducers({
   categoryTree: CategoryTreeReducer,
   category: CategoryReducer,
   product: ProductReducer,
   magento: MagentoReducer,
   nav: NavigationReducer
 });
