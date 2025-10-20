import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new order
export const create = mutation({
  args: {
    orderId: v.string(),
    paypalOrderId: v.string(),
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
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      orderId: args.orderId,
      paypalOrderId: args.paypalOrderId,
      customerEmail: args.customerEmail,
      customerName: args.customerName,
      items: args.items,
      subtotal: args.subtotal,
      shipping: args.shipping,
      tax: args.tax,
      total: args.total,
      status: args.status,
    });

    return orderId;
  },
});

// Get order by PayPal order ID
export const getByPaypalOrderId = query({
  args: { paypalOrderId: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("byPaypalOrderId", (q) => q.eq("paypalOrderId", args.paypalOrderId))
      .first();

    return order;
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
