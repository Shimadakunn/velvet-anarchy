import { Id } from "@/convex/_generated/dataModel";

export type Product = {
  _id?: Id<"products">;
  name: string;
  slug: string;
  detail: string;
  price: number;
  rating: number;
  review: number;
  sold: number;
  stock: number;
  images: string[];
  trending?: boolean;
  mostPopular?: boolean;
  order?: number;
  isActive?: boolean;
  sizeGuide?: string;
  cardImage?: string;
  _creationTime?: number;
};

export type Variant = {
  _id?: Id<"variants">;
  productId?: Id<"products">;
  type: VariantType;
  value: string;
  subvalue?: string;
  images?: string[];
  variantLink?: string;
  _creationTime?: number;
};

export type VariantType = "size" | "color";

export const variantTypes: VariantType[] = ["color", "size"];

export type Review = {
  _id?: Id<"reviews">;
  productId?: Id<"products">;
  orderId?: string; // Optional - only required for customer reviews, not admin
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  reviewImages?: string[]; // Images of the product received by the customer
  _creationTime?: number;
};
