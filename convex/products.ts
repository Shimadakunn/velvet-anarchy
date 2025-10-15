import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
    return product;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    detail: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    rating: v.number(),
    reviews: v.number(),
    sold: v.number(),
    stock: v.number(),
    variants: v.array(
      v.object({
        type: v.union(v.literal("size"), v.literal("color")),
        value: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Extract variants from args
    const { variants, ...productData } = args;

    // Insert the product
    const productId = await ctx.db.insert("products", productData);

    // Insert all variants
    for (const variant of variants) {
      await ctx.db.insert("variants", {
        productId,
        type: variant.type,
        value: variant.value,
      });
    }

    return productId;
  },
});
