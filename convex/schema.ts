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
    orderId: v.string(), // Unique order identifier (PayPal transaction ID)
    customerEmail: v.string(),
    customerName: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        productImage: v.string(),
        price: v.number(),
        quantity: v.number(),
        variants: v.object({
          color: v.string(),
          size: v.string(),
        }),
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    tax: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("shipping"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    shippingStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("in_transit"),
      v.literal("out_for_delivery"),
      v.literal("delivered")
    ),
    shippingAddress: v.optional(
      v.object({
        name: v.string(),
        addressLine1: v.string(),
        addressLine2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
  })
    .index("byOrderId", ["orderId"])
    .index("byEmail", ["customerEmail"]),

  reviews: defineTable({
    productId: v.id("products"),
    userName: v.string(),
    userImage: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    date: v.string(),
    reviewImages: v.optional(v.array(v.string())),
  }).index("byProduct", ["productId"]),
});
