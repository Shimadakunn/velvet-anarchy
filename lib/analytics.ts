import posthog from "posthog-js";
import { CartItem } from "@/store/cartStore";

// Shopping behavior event types
export const AnalyticsEvents = {
  // Product Discovery
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_LIST_VIEWED: "product_list_viewed",
  PRODUCT_CLICKED: "product_clicked",
  
  // Cart Events
  PRODUCT_ADDED_TO_CART: "product_added_to_cart",
  PRODUCT_REMOVED_FROM_CART: "product_removed_from_cart",
  CART_QUANTITY_UPDATED: "cart_quantity_updated",
  CART_VIEWED: "cart_viewed",
  CART_CLEARED: "cart_cleared",
  
  // Checkout Events
  CHECKOUT_STARTED: "checkout_started",
  CHECKOUT_COMPLETED: "checkout_completed",
  PAYMENT_INFO_ENTERED: "payment_info_entered",
  
  // Purchase Events
  PURCHASE_COMPLETED: "purchase_completed",
  ORDER_VIEWED: "order_viewed",
  
  // Engagement Events
  REVIEW_SUBMITTED: "review_submitted",
  VARIANT_SELECTED: "variant_selected",
  QUANTITY_CHANGED: "quantity_changed",
  
  // Navigation Events
  SEARCH_PERFORMED: "search_performed",
  FILTER_APPLIED: "filter_applied",
} as const;

// Track product view
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  slug: string;
  category?: string;
  rating?: number;
  stock?: number;
}) => {
  posthog.capture(AnalyticsEvents.PRODUCT_VIEWED, {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_slug: product.slug,
    product_category: product.category,
    product_rating: product.rating,
    product_stock: product.stock,
    currency: "EUR",
  });
};

// Track product list view
export const trackProductListView = (products: Array<{
  id: string;
  name: string;
  price: number;
}>) => {
  posthog.capture(AnalyticsEvents.PRODUCT_LIST_VIEWED, {
    product_count: products.length,
    products: products.map(p => ({
      product_id: p.id,
      product_name: p.name,
      product_price: p.price,
    })),
  });
};

// Track add to cart
export const trackAddToCart = (item: {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  variants: Record<string, string>;
}) => {
  posthog.capture(AnalyticsEvents.PRODUCT_ADDED_TO_CART, {
    product_id: item.productId,
    product_name: item.productName,
    product_price: item.price,
    quantity: item.quantity,
    variants: item.variants,
    cart_value: item.price * item.quantity,
    currency: "EUR",
  });
};

// Track remove from cart
export const trackRemoveFromCart = (item: CartItem) => {
  posthog.capture(AnalyticsEvents.PRODUCT_REMOVED_FROM_CART, {
    product_id: item.productId,
    product_name: item.productName,
    product_price: item.price,
    quantity: item.quantity,
    variants: item.variants,
    cart_value: item.price * item.quantity,
    currency: "EUR",
  });
};

// Track cart quantity update
export const trackCartQuantityUpdate = (item: {
  productId: string;
  productName: string;
  oldQuantity: number;
  newQuantity: number;
  price: number;
}) => {
  posthog.capture(AnalyticsEvents.CART_QUANTITY_UPDATED, {
    product_id: item.productId,
    product_name: item.productName,
    old_quantity: item.oldQuantity,
    new_quantity: item.newQuantity,
    quantity_change: item.newQuantity - item.oldQuantity,
    product_price: item.price,
    currency: "EUR",
  });
};

// Track cart view
export const trackCartView = (cart: {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}) => {
  posthog.capture(AnalyticsEvents.CART_VIEWED, {
    cart_total: cart.totalPrice,
    cart_item_count: cart.totalItems,
    cart_unique_products: cart.items.length,
    currency: "EUR",
    products: cart.items.map(item => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
  });
};

// Track checkout start
export const trackCheckoutStart = (cart: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  discountApplied: boolean;
  discountAmount?: number;
}) => {
  posthog.capture(AnalyticsEvents.CHECKOUT_STARTED, {
    cart_total: cart.total,
    cart_subtotal: cart.subtotal,
    shipping_cost: cart.shipping,
    discount_applied: cart.discountApplied,
    discount_amount: cart.discountAmount || 0,
    item_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    unique_products: cart.items.length,
    currency: "EUR",
    products: cart.items.map(item => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      variants: item.variants,
    })),
  });
};

// Track purchase completion
export const trackPurchaseComplete = (order: {
  orderId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    variants: Record<string, string>;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  discountAmount?: number;
}) => {
  posthog.capture(AnalyticsEvents.PURCHASE_COMPLETED, {
    order_id: order.orderId,
    revenue: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount_amount: order.discountAmount || 0,
    currency: "EUR",
    item_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
    unique_products: order.items.length,
    products: order.items.map(item => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      variants: item.variants,
      revenue: item.price * item.quantity,
    })),
  });

  // Also set user properties for lifetime value tracking
  posthog.people?.set({
    last_purchase_date: new Date().toISOString(),
    last_purchase_amount: order.total,
  });

  // Increment lifetime value
  posthog.people?.increment("lifetime_purchases", 1);
  posthog.people?.increment("lifetime_revenue", order.total);
};

// Track order view (success page)
export const trackOrderView = (order: {
  orderId: string;
  total: number;
  itemCount: number;
}) => {
  posthog.capture(AnalyticsEvents.ORDER_VIEWED, {
    order_id: order.orderId,
    order_total: order.total,
    item_count: order.itemCount,
    currency: "EUR",
  });
};

// Track review submission
export const trackReviewSubmit = (review: {
  productId: string;
  rating: number;
  hasComment: boolean;
  hasImages: boolean;
  imageCount?: number;
}) => {
  posthog.capture(AnalyticsEvents.REVIEW_SUBMITTED, {
    product_id: review.productId,
    rating: review.rating,
    has_comment: review.hasComment,
    has_images: review.hasImages,
    image_count: review.imageCount || 0,
  });
};

// Track variant selection
export const trackVariantSelect = (variant: {
  productId: string;
  productName: string;
  variantType: string;
  variantValue: string;
}) => {
  posthog.capture(AnalyticsEvents.VARIANT_SELECTED, {
    product_id: variant.productId,
    product_name: variant.productName,
    variant_type: variant.variantType,
    variant_value: variant.variantValue,
  });
};

// Track quantity change on product page
export const trackQuantityChange = (product: {
  productId: string;
  productName: string;
  oldQuantity: number;
  newQuantity: number;
}) => {
  posthog.capture(AnalyticsEvents.QUANTITY_CHANGED, {
    product_id: product.productId,
    product_name: product.productName,
    old_quantity: product.oldQuantity,
    new_quantity: product.newQuantity,
    quantity_change: product.newQuantity - product.oldQuantity,
  });
};

// Track product click from list
export const trackProductClick = (product: {
  id: string;
  name: string;
  price: number;
  position?: number;
  listName?: string;
}) => {
  posthog.capture(AnalyticsEvents.PRODUCT_CLICKED, {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    position: product.position,
    list_name: product.listName || "product_list",
    currency: "EUR",
  });
};

// Helper to identify user by email (call after purchase or login)
export const identifyUser = (email: string, properties?: Record<string, any>) => {
  posthog.identify(email, properties);
};
