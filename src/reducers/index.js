 import { combineReducers } from 'redux';
 import CategoryTreeReducer from './CategoryTreeReducer';
 import NavigationReducer from './NavigationReducer';
 import CategoryReducer from './CategoryReducer';
 import CheckoutReducer from './CheckoutReducer';
 import MagentoReducer from './MagentoReducer';
 import ProductReducer from './ProductReducer';
 import CartReducer from './CartReducer';

 export default combineReducers({
   categoryTree: CategoryTreeReducer,
   category: CategoryReducer,
   checkout: CheckoutReducer,
   product: ProductReducer,
   magento: MagentoReducer,
   nav: NavigationReducer,
   cart: CartReducer
 });
