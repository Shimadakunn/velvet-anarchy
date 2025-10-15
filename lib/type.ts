export type Product = {
  _id: string;
  name: string;
  slug: string;
  detail: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  _creationTime: string;
};

export type Variant = {
  _id: string;
  productId: string;
  type: "size" | "color";
  value: string;
  _creationTime: string;
};
