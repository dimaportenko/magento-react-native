export const ADMIN_TYPE = 'magento_admin_type';
export const GUEST_TYPE = 'magento_guest_type';
export const CUSTOMER_TYPE = 'magento_customer_type';

export type AddressType = {
  city: string;
  country_id: string;
  firstname: string;
  lastname: string;
  postcode: string;
  customer_id: number;
  id: number;
  region: RegionType;
  street: string[];
  telephone: string;
};

export type RegionType = {
  region: string;
  region_code: string;
  region_id: number;
};

export type CustomerType = {
  addresses: AddressType[];
  email: string;
  firstname: string;
  lastname: string;
  group_id: number;
  id: number;
  store_id: number;
  website_id: number;
};

export type OrderItemType = {
  // amount_refunded: 0
  // base_amount_refunded: 0
  // base_discount_amount: 0
  // base_discount_invoiced: 0
  // base_price: 0
  // base_row_invoiced: 0
  // base_row_total: 0
  // base_row_total_incl_tax: 0
  // base_tax_amount: 0
  // base_tax_invoiced: 0
  // created_at: "2021-08-27 18:14:24"
  // discount_amount: 0
  // discount_invoiced: 0
  // discount_percent: 0
  // free_shipping: 0
  // is_qty_decimal: 0
  // is_virtual: 0
  // item_id: 8
  name: string;
  // no_discount: 0
  // order_id: 5
  // original_price: 0
  // parent_item: Object
  // parent_item_id: 7
  price: number;
  // product_id: 1145
  // product_type: "simple"
  // qty_canceled: 0
  // qty_invoiced: 0
  qty_ordered: number;
  // qty_refunded: 0
  // qty_shipped: 0
  // quote_item_id: 10
  // row_invoiced: 0
  row_total: number;
  // row_total_incl_tax: 0
  // row_weight: 0
  sku: string;
  // store_id: 1
  // tax_amount: 0
  // tax_invoiced: 0
  // tax_percent: 0
  // updated_at: "2021-08-27 18:14:24"
  // weight: 1
};

export type OrderType = {
  // applied_rule_ids: string;
  // base_currency_code: string;
  created_at: string;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  // global_currency_code: string;
  increment_id: string;
  order_currency_code: string;
  // shipping_description: string;
  // state: string;
  status: string;
  // store_currency_code: string;
  // store_name: string;
  // updated_at: string;
  // base_discount_amount: number;
  // base_discount_tax_compensation_amount: number;
  // base_grand_total: number;
  // base_shipping_amount: number;
  // base_shipping_discount_amount: number;
  // base_shipping_discount_tax_compensation_amnt: number;
  // base_shipping_incl_tax: number;
  // base_shipping_tax_amount: number;
  // base_subtotal: number;
  // base_subtotal_incl_tax: number;
  // base_tax_amount: number;
  // base_to_global_rate: number;
  // base_to_order_rate: number;
  // base_total_due: number;
  // billing_address_id: number;
  // customer_group_id: number;
  // customer_id: number;
  // customer_is_guest: number;
  // customer_note_notify: number;
  // discount_amount: number;
  // discount_tax_compensation_amount: number;
  // email_sent: number;
  // entity_id: number;
  grand_total: number;
  // is_virtual: number;
  // quote_id: number;
  shipping_amount: number;
  // shipping_discount_amount: number;
  // shipping_discount_tax_compensation_amount: number;
  // shipping_incl_tax: number;
  // shipping_tax_amount: number;
  // store_id: number;
  // store_to_base_rate: number;
  // store_to_order_rate: number;
  subtotal: number;
  // subtotal_incl_tax: number;
  // tax_amount: number;
  total_due: number;
  // total_item_count: number;
  // total_qty_ordered: number;
  // weight: number;

  // billing_address: AddressType;
  items: OrderItemType[];
  // payment: Object
  // extension_attributes: Object
};

export type ProductCustomAttribute = {

}

export type ProductType = {
  // attribute_set_id: 9
  // created_at: "2021-06-15 09:35:17"
  custom_attributes: ProductCustomAttribute[];
  // extension_attributes: Object
  id: number;
  // media_gallery_entries: Array(1)
  name: string;
  // options: Array(0)
  price: number;
  // product_links: Array(0)
  sku: string;
  // status: 1
  // tier_prices: Array(0)
  type_id: 'simple' | 'configurable';
  // updated_at: "2021-06-15 09:35:17"
  // visibility: 1
  // weight: 1
  children?: ProductType[];
};

export type QuoteItemType = {
  item_id: number;
  price: number;
  qty: number;
  name: string;
  product_type: string;
  quote_id: string;
  sku: string;
  thumbnail?: string;
};

export type QuoteType = {
  // currency: Object
  // extension_attributes: Object
  created_at?: string;
  billing_address?: AddressType;
  customer?: CustomerType;
  customer_is_guest?: boolean;
  customer_note_notify?: boolean;
  customer_tax_class_id?: number;
  id?: number;
  is_active?: boolean;
  is_virtual?: boolean;
  items?: QuoteItemType[];
  items_count?: number;
  items_qty?: number;
  orig_order_id?: number;
  store_id?: number;
  updated_at?: string;
};

export type StoreConfigType = {
  base_currency_code: string;
  base_link_url: string;
  base_media_url: string;
  base_static_url: string;
  base_url: string;
  code: string;
  default_display_currency_code: string;
  locale: string;
  secure_base_link_url: string;
  secure_base_media_url: string;
  secure_base_static_url: string;
  secure_base_url: string;
  timezone: string;
  weight_unit: string;
  website_id: number;
  id: number;
};

export type CountryRegionType = {
  code: string;
  id: string;
  name: string;
};

export type CountryType = {
  full_name_english: string;
  full_name_locale: string;
  id: string;
  three_letter_abbreviation: string;
  two_letter_abbreviation: string;
  available_regions: CountryRegionType[];
};

export type CategoryType = {
  children_data: CategoryType[];
  id: number;
  is_active: boolean;
  name: string;
  level: number;
  parent_id: number;
  position: number;
  product_count: number;
};

export type MediaItem = {
  disabled: boolean;
  id: number;
  position: number;
  file: string;
  label: string;
  media_type: string;
};
