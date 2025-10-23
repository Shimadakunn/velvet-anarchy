import { Id } from "@/convex/_generated/dataModel";

export type Product = {
  _id?: Id<"products">;
  name: string;
  slug: string;
  detail: string;
  price: number;
  rating: number;
  sold: number;
  stock: number;
  images: string[];
  _creationTime?: number;
};

export type Variant = {
  _id?: Id<"variants">;
  productId?: Id<"products">;
  type: VariantType;
  value: string;
  image?: string;
  _creationTime?: number;
};

export type VariantType = "size" | "color";

export const variantTypes: VariantType[] = ["color", "size"];

export type Review = {
  _id?: Id<"reviews">;
  productId?: Id<"products">;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  reviewImages?: string[]; // Images of the product received by the customer
  _creationTime?: number;
};
