import { combineReducers } from 'redux';
import CategoryTreeReducer from './CategoryTreeReducer';
import CustomerAuthReducer from './CustomerAuthReducer';
import CategoryReducer from './CategoryReducer';
import CheckoutReducer from './CheckoutReducer';
import MagentoReducer from './MagentoReducer';
import ProductReducer from './ProductReducer';
import AccountReducer from './AccountReducer';
import CartReducer from './CartReducer';
import HomeReducer from './HomeReducer';
import SearchReducer from './SearchReducer';
import FilterReducer from './FilterReducer';
import UIReducer from './UIReducer';

export default combineReducers({
  categoryTree: CategoryTreeReducer,
  customerAuth: CustomerAuthReducer,
  category: CategoryReducer,
  checkout: CheckoutReducer,
  product: ProductReducer,
  magento: MagentoReducer,
  account: AccountReducer,
  cart: CartReducer,
  home: HomeReducer,
  search: SearchReducer,
  filters: FilterReducer,
  ui: UIReducer,
});
