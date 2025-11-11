import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    // Sort by order field (ascending), with products without order at the end
    return products.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    // Filter only active products (isActive is true or undefined/null)
    const activeProducts = products.filter(
      (p) => p.isActive === undefined || p.isActive === true
    );
    // Sort by order field (ascending), with products without order at the end
    return activeProducts.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
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
    review: v.number(),
    sold: v.number(),
    stock: v.number(),
    trending: v.optional(v.boolean()),
    mostPopular: v.optional(v.boolean()),
    order: v.optional(v.number()),
    sizeGuide: v.optional(v.string()),
    cardImage: v.optional(v.string()),
    variants: v.array(
      v.object({
        type: v.union(v.literal("size"), v.literal("color")),
        value: v.string(),
        subvalue: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        variantLink: v.optional(v.string()),
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
        images: variant.images,
        variantLink: variant.variantLink,
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
    review: v.number(),
    sold: v.number(),
    stock: v.number(),
    trending: v.optional(v.boolean()),
    mostPopular: v.optional(v.boolean()),
    order: v.optional(v.number()),
    sizeGuide: v.optional(v.string()),
    cardImage: v.optional(v.string()),
    variants: v.array(
      v.object({
        type: v.union(v.literal("size"), v.literal("color")),
        value: v.string(),
        subvalue: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        variantLink: v.optional(v.string()),
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
        images: variant.images,
        variantLink: variant.variantLink,
      });
    }

    return id;
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("products"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { order: args.order });
    return args.id;
  },
});

export const updateMostPopular = mutation({
  args: {
    id: v.id("products"),
    mostPopular: v.boolean(),
  },
  handler: async (ctx, args) => {
    // If setting a product as most popular, unset all other products
    if (args.mostPopular) {
      const allProducts = await ctx.db.query("products").collect();
      for (const product of allProducts) {
        if (product._id !== args.id && product.mostPopular) {
          await ctx.db.patch(product._id, { mostPopular: false });
        }
      }
    }
    await ctx.db.patch(args.id, { mostPopular: args.mostPopular });
    return args.id;
  },
});

export const updateTrending = mutation({
  args: {
    id: v.id("products"),
    trending: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { trending: args.trending });
    return args.id;
  },
});

export const toggleActive = mutation({
  args: {
    id: v.id("products"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: args.isActive });
    return args.id;
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Delete all variants associated with the product
    const variants = await ctx.db
      .query("variants")
      .withIndex("byProduct", (q) => q.eq("productId", args.id))
      .collect();

    for (const variant of variants) {
      await ctx.db.delete(variant._id);
    }

    // Delete the product
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const updateInventory = mutation({
  args: {
    productId: v.id("products"),
    quantitySold: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Update sold count and decrease stock
    await ctx.db.patch(args.productId, {
      sold: product.sold + args.quantitySold,
      stock: Math.max(0, product.stock - args.quantitySold),
    });

    return args.productId;
  },
});
