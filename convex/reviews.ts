import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

// Admin mutation - no orderId required, no verification
export const create = mutation({
  args: {
    productId: v.id("products"),
    orderId: v.optional(v.string()),
    userName: v.string(),
    userImage: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    date: v.string(),
    reviewImages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    userName: v.optional(v.string()),
    userImage: v.optional(v.string()),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const deleteReview = mutation({
  args: {
    id: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Verify order eligibility and create review
export const createWithVerification = mutation({
  args: {
    email: v.string(),
    orderId: v.string(),
    productId: v.id("products"),
    userName: v.string(),
    userImage: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    reviewImages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Find the order
    const order = await ctx.db
      .query("orders")
      .withIndex("byOrderId", (q) => q.eq("orderId", args.orderId))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify email matches
    if (order.customerEmail.toLowerCase() !== args.email.toLowerCase()) {
      throw new Error("Email does not match order");
    }

    // Verify order status is completed
    if (order.status !== "completed") {
      throw new Error("Order must be completed to leave a review");
    }

    // Verify shipping status is delivered
    if (order.shippingStatus !== "delivered") {
      throw new Error("Product must be delivered to leave a review");
    }

    // Verify the product was in the order
    const productInOrder = order.items.find(
      (item) => item.productId === args.productId
    );

    if (!productInOrder) {
      throw new Error("Product not found in order");
    }

    // Check if user already reviewed this product for this specific order
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .collect();

    const existingReview = allReviews.find(
      (review) => review.orderId === args.orderId
    );

    if (existingReview) {
      throw new Error("You have already reviewed this product for this order");
    }

    // Create the review
    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      orderId: args.orderId,
      userName: args.userName,
      userImage: args.userImage,
      rating: args.rating,
      comment: args.comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      reviewImages: args.reviewImages,
    });

    // Increment the product review count
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, {
        review: product.review + 1,
      });
    }

    return reviewId;
  },
});
