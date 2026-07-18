import { api } from "@/axios/instance";

export interface GetProductsResponse {
  data: {
    products: Product[];
    categories: Category[];
    name: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string[];
  price: number;
  promo_price: number;
  stock: Stock;
  category: Category;
  numreview?: number;
  numReview: number;
  totalstars: number;
  delete: boolean;
  date: string;
  __v: number;
  offer?: Offer;
}

export interface Stock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  action: string;
  slug: string;
  delete: boolean;
  date: string;
  __v: number;
  offer?: number;
}

export interface Offer {
  _id: string;
  product: string;
  offerName: string;
  offerDescription: string;
  Discount: number;
  offertype: string;
  isActive: boolean;
  __v: number;
}

export const getHomeData = async () => {
  const response = await api.get<GetProductsResponse>('/home');
  return response.data;
};

export interface GetProductDetailsResponse {
  product: Product;
  totalstock: number;
  relatedProduct: Product[];
  RatingProduct?: any[];
  CountRating?: number;
}

export const getProductDetails = async (id: string) => {
  const response = await api.get<GetProductDetailsResponse>(`/product/detail?id=${id}`);
  return response.data;
};
