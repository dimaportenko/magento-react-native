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
