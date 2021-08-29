import { combineReducers } from 'redux';
import CategoryTreeReducer, {
  CategoryTreeReducerType,
} from './CategoryTreeReducer';
import CustomerAuthReducer from './CustomerAuthReducer';
import CategoryReducer, { CategoryReducerType } from './CategoryReducer';
import CheckoutReducer, { CheckoutReducerType } from './CheckoutReducer';
import MagentoReducer, { MagentoReducerType } from './MagentoReducer';
import ProductReducer, { ProductReducerType } from './ProductReducer';
import AccountReducer, { AccountReducerType } from './AccountReducer';
import CartReducer, { CartReducerType } from './CartReducer';
import HomeReducer from './HomeReducer';
import SearchReducer, { SearchReducerType } from './SearchReducer';
import FilterReducer, { FilterReducerType } from './FilterReducer';
import UIReducer, { UIReducerType } from './UIReducer';

export type StoreStateType = {
  cart: CartReducerType;
  magento: MagentoReducerType;
  category: CategoryReducerType;
  filters: FilterReducerType;
  ui: UIReducerType;
  categoryTree: CategoryTreeReducerType;
  search: SearchReducerType;
  account: AccountReducerType;
  product: ProductReducerType;
  checkout: CheckoutReducerType;
};

export default combineReducers<StoreStateType>({
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
