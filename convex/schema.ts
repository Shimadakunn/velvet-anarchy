import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    detail: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    rating: v.number(),
    reviews: v.number(),
    sold: v.number(),
    stock: v.number(),
  }).index("bySlug", ["slug"]),

  variants: defineTable({
    productId: v.id("products"),
    type: v.union(v.literal("size"), v.literal("color")),
    value: v.string(),
    image: v.optional(v.string()),
  }).index("byProduct", ["productId"]),

  orders: defineTable({
    productId: v.id("products"),
    quantity: v.number(),
    totalPrice: v.number(),
  }).index("byProduct", ["productId"]),
});
