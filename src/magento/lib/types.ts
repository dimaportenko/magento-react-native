export type AddToCartItemApiParamType = {
  cartItem: {
    sku: string;
    qty: number;
    quoteId: string;
    productOption?: {
      extensionAttributes: {
        configurableItemOptions?: {
          optionId: string;
          optionValue: string;
        }[];
        customOptions?: {
          optionId: string;
          optionValue: string;
        }[];
      };
    };
  };
};

export type CustomerAddressApiParamType = {
  address: {
    region: string;
    region_id: string;
    region_code: string;
    country_id: string;
    street: string[];
    telephone: string;
    postcode: string;
    city: string;
    firstname: string;
    lastname: string;
    email: string;
    same_as_billing: number;
  };
};

export type CartPaymentApiParamType = {
  paymentMethod: {
    method: string;
  };
};

export type PostReviewRatingData = {
  ratingCode: string;
  ratingValue: string | number;
  rating_id: string;
};

export type PostReviewDataApiParamType = {
  detail: string;
  nickname: string;
  title: string;
  productId: number;
  ratingData: PostReviewRatingData[];
};

export type AddressDataType = {
  city: string;
  country_id: string;
  firstname?: string;
  lastname?: string;
  postcode: string;
  customer_id?: number;
  id?: number;
  region: RegionDataType;
  street: string[];
  telephone: string;
};

export type RegionDataType = {
  region?: string;
  region_code?: string;
  region_id?: number;
};

export type CustomerDataType = {
  customer: {
    addresses: AddressDataType[];
    email: string;
    firstname: string;
    lastname: string;
    group_id: number;
    id: number;
    store_id: number;
    website_id: number;
  };
};
