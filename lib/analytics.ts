import posthog from "posthog-js";
import { CartItem } from "@/store/cartStore";
import { Product, VariantType } from "@/lib/type";

/**
 * Analytics utility for tracking user shopping behavior with PostHog
 */

// Product Events
export const trackProductViewed = (product: Product) => {
  posthog.capture("product_viewed", {
    product_id: product._id,
    product_name: product.name,
    product_slug: product.slug,
    product_price: product.price,
    product_rating: product.rating,
    product_stock: product.stock,
    product_sold: product.sold,
    is_trending: product.trending || false,
    is_most_popular: product.mostPopular || false,
  });
};

export const trackProductClicked = (product: Product, source: string) => {
  posthog.capture("product_clicked", {
    product_id: product._id,
    product_name: product.name,
    product_slug: product.slug,
    product_price: product.price,
    source, // e.g., "homepage", "products_page", "search_results"
  });
};

// Variant Events
export const trackVariantSelected = (
  product: Product,
  variantType: VariantType,
  variantValue: string
) => {
  posthog.capture("variant_selected", {
    product_id: product._id,
    product_name: product.name,
    variant_type: variantType,
    variant_value: variantValue,
  });
};

// Cart Events
export const trackAddToCart = (
  product: Product,
  variants: Record<VariantType, string>,
  quantity: number
) => {
  posthog.capture("add_to_cart", {
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    quantity,
    variants,
    total_value: product.price * quantity,
  });
};

export const trackRemoveFromCart = (item: CartItem) => {
  posthog.capture("remove_from_cart", {
    product_id: item.productId,
    product_name: item.productName,
    product_price: item.price,
    quantity: item.quantity,
    variants: item.variants,
    total_value: item.price * item.quantity,
  });
};

export const trackCartQuantityUpdated = (
  item: CartItem,
  oldQuantity: number,
  newQuantity: number
) => {
  posthog.capture("cart_quantity_updated", {
    product_id: item.productId,
    product_name: item.productName,
    product_price: item.price,
    old_quantity: oldQuantity,
    new_quantity: newQuantity,
    quantity_change: newQuantity - oldQuantity,
    variants: item.variants,
  });
};

export const trackCartOpened = (
  items: CartItem[],
  totalItems: number,
  totalValue: number
) => {
  posthog.capture("cart_opened", {
    cart_item_count: totalItems,
    cart_total_value: totalValue,
    cart_items: items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
  });
};

export const trackCartClosed = () => {
  posthog.capture("cart_closed");
};

// Checkout Events
export const trackCheckoutInitiated = (
  items: CartItem[],
  subtotal: number,
  shipping: number,
  total: number,
  hasDiscount: boolean,
  discountAmount?: number
) => {
  posthog.capture("checkout_initiated", {
    cart_item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    total,
    has_discount: hasDiscount,
    discount_amount: discountAmount || 0,
    items: items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      variants: item.variants,
    })),
  });
};

export const trackPaymentStarted = (
  paymentMethod: string,
  total: number
) => {
  posthog.capture("payment_started", {
    payment_method: paymentMethod,
    total_amount: total,
  });
};

export const trackPurchaseCompleted = (
  orderId: string,
  items: CartItem[],
  subtotal: number,
  shipping: number,
  total: number,
  hasDiscount: boolean,
  discountAmount?: number
) => {
  posthog.capture("purchase_completed", {
    order_id: orderId,
    cart_item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    total,
    has_discount: hasDiscount,
    discount_amount: discountAmount || 0,
    items: items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      variants: item.variants,
    })),
  });

  // Also track revenue for PostHog's revenue tracking
  posthog.capture("$transaction", {
    order_id: orderId,
    revenue: total,
    currency: "EUR",
  });
};

// Buy Now Event (direct checkout)
export const trackBuyNow = (
  product: Product,
  variants: Record<VariantType, string>,
  quantity: number
) => {
  posthog.capture("buy_now_clicked", {
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    quantity,
    variants,
    total_value: product.price * quantity,
  });
};

// Navigation Events
export const trackPageView = (pageName: string, properties?: Record<string, unknown>) => {
  posthog.capture("$pageview", {
    page_name: pageName,
    ...properties,
  });
};

// Search Events (if you add search functionality)
export const trackSearch = (query: string, resultsCount: number) => {
  posthog.capture("search_performed", {
    search_query: query,
    results_count: resultsCount,
  });
};

// Review Events
export const trackReviewAdded = (
  productId: string,
  productName: string,
  rating: number
) => {
  posthog.capture("review_added", {
    product_id: productId,
    product_name: productName,
    rating,
  });
};

// User Engagement Events
export const trackScrollDepth = (depth: number, pageName: string) => {
  posthog.capture("scroll_depth", {
    depth_percentage: depth,
    page_name: pageName,
  });
};

export const trackTimeOnPage = (timeInSeconds: number, pageName: string) => {
  posthog.capture("time_on_page", {
    time_seconds: timeInSeconds,
    page_name: pageName,
  });
};
