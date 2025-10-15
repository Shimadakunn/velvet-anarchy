import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const get = query({
  args: {
    slug: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.slug);
  },
});
