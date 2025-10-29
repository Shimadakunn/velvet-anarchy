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

export const create = mutation({
  args: {
    productId: v.id("products"),
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
