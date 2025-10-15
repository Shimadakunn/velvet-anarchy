import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("variants")
      .withIndex("byProduct", (q) => q.eq("productId", args.id))
      .collect();
  },
});
