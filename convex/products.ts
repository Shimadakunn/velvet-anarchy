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
    sold: v.number(),
    stock: v.number(),
    variants: v.array(
      v.object({
        type: v.union(v.literal("size"), v.literal("color")),
        value: v.string(),
        subvalue: v.optional(v.string()),
        image: v.optional(v.string()),
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
        subvalue: variant.subvalue,
        image: variant.image,
      });
    }

    return productId;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    slug: v.string(),
    detail: v.string(),
    images: v.array(v.string()),
    price: v.number(),
    rating: v.number(),
    sold: v.number(),
    stock: v.number(),
    variants: v.array(
      v.object({
        type: v.union(v.literal("size"), v.literal("color")),
        value: v.string(),
        subvalue: v.optional(v.string()),
        image: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Extract variants and id from args
    const { id, variants, ...productData } = args;

    // Update the product
    await ctx.db.patch(id, productData);

    // Delete existing variants
    const existingVariants = await ctx.db
      .query("variants")
      .withIndex("byProduct", (q) => q.eq("productId", id))
      .collect();

    for (const variant of existingVariants) {
      await ctx.db.delete(variant._id);
    }

    // Insert new variants
    for (const variant of variants) {
      await ctx.db.insert("variants", {
        productId: id,
        type: variant.type,
        value: variant.value,
        subvalue: variant.subvalue,
        image: variant.image,
      });
    }

    return id;
  },
});
