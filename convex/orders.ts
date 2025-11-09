import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new order
export const create = mutation({
  args: {
    orderId: v.string(),
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
    shippingAddress: v.object({
      name: v.string(),
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      orderId: args.orderId,
      customerEmail: args.customerEmail,
      customerName: args.customerName,
      items: args.items,
      subtotal: args.subtotal,
      shipping: args.shipping,
      tax: args.tax,
      total: args.total,
      status: args.status,
      shippingStatus: args.shippingStatus,
      shippingAddress: args.shippingAddress,
    });

    return orderId;
  },
});

// Get order by custom order ID
export const getByOrderId = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("byOrderId", (q) => q.eq("orderId", args.orderId))
      .first();

    return order;
  },
});

// Get all orders for a customer email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("byEmail", (q) => q.eq("customerEmail", args.email))
      .collect();

    return orders;
  },
});

// Get all orders (for admin)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return orders;
  },
});

// Update order status
export const updateStatus = mutation({
  args: {
    orderId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("shipping"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("byOrderId", (q) => q.eq("orderId", args.orderId))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, {
      status: args.status,
    });

    return order._id;
  },
});

// Update shipping status
export const updateShippingStatus = mutation({
  args: {
    orderId: v.string(),
    shippingStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("in_transit"),
      v.literal("out_for_delivery"),
      v.literal("delivered")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("byOrderId", (q) => q.eq("orderId", args.orderId))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, {
      shippingStatus: args.shippingStatus,
    });

    return order._id;
  },
});

// Update China Order ID
export const updateChinaOrderId = mutation({
  args: {
    orderId: v.string(),
    chinaOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("byOrderId", (q) => q.eq("orderId", args.orderId))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, {
      chinaOrderId: args.chinaOrderId,
    });

    return order._id;
  },
});
