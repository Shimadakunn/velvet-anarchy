import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all active hero slides ordered by their order field
export const getActiveSlides = query({
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("hero")
      .withIndex("byOrder")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Fetch product details and image URLs for each slide
    const slidesWithProducts = await Promise.all(
      slides.map(async (slide) => {
        const imageUrl = slide.image ? await ctx.storage.getUrl(slide.image) : null;

        if (slide.productId) {
          const product = await ctx.db.get(slide.productId);
          return {
            ...slide,
            imageUrl: imageUrl || "",
            product: product ? { slug: product.slug, name: product.name } : null,
          };
        }
        return {
          ...slide,
          imageUrl: imageUrl || "",
          product: null
        };
      })
    );

    return slidesWithProducts.sort((a, b) => a.order - b.order);
  },
});

// Get all hero slides (for admin)
export const getAllSlides = query({
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("hero")
      .withIndex("byOrder")
      .collect();

    // Fetch product details and image URLs for each slide
    const slidesWithProducts = await Promise.all(
      slides.map(async (slide) => {
        const imageUrl = slide.image ? await ctx.storage.getUrl(slide.image) : null;

        if (slide.productId) {
          const product = await ctx.db.get(slide.productId);
          return {
            ...slide,
            imageUrl: imageUrl || "",
            product: product ? { slug: product.slug, name: product.name } : null,
          };
        }
        return {
          ...slide,
          imageUrl: imageUrl || "",
          product: null
        };
      })
    );

    return slidesWithProducts.sort((a, b) => a.order - b.order);
  },
});

// Create a new hero slide
export const createSlide = mutation({
  args: {
    image: v.string(),
    title: v.string(),
    productId: v.optional(v.id("products")),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const slideId = await ctx.db.insert("hero", {
      image: args.image,
      title: args.title,
      productId: args.productId,
      order: args.order,
      isActive: args.isActive,
    });
    return slideId;
  },
});

// Update an existing hero slide
export const updateSlide = mutation({
  args: {
    id: v.id("hero"),
    image: v.optional(v.string()),
    title: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a hero slide
export const deleteSlide = mutation({
  args: {
    id: v.id("hero"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle slide active status
export const toggleSlideActive = mutation({
  args: {
    id: v.id("hero"),
  },
  handler: async (ctx, args) => {
    const slide = await ctx.db.get(args.id);
    if (!slide) throw new Error("Slide not found");

    await ctx.db.patch(args.id, {
      isActive: !slide.isActive,
    });
  },
});

// Update multiple slides' orders (for drag and drop reordering)
export const updateSlideOrders = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("hero"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Update all slides with their new orders
    await Promise.all(
      args.updates.map((update) =>
        ctx.db.patch(update.id, { order: update.order })
      )
    );
  },
});
