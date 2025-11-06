# PostHog Analytics Tracking Documentation

This document outlines all the shopping behavior events tracked using PostHog analytics in this e-commerce application.

## Overview

The analytics implementation tracks comprehensive user shopping behavior throughout the entire customer journey, from product discovery to purchase completion.

## Events Tracked

### 1. Product Discovery Events

#### `product_viewed`
Triggered when a user views a product detail page.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_slug`: URL slug of the product
- `product_price`: Price of the product
- `product_rating`: Average rating
- `product_stock`: Available stock
- `product_sold`: Number of units sold
- `is_trending`: Whether product is marked as trending
- `is_most_popular`: Whether product is marked as most popular

**Location:** `/app/product/[slug]/page.tsx`

#### `product_clicked`
Triggered when a user clicks on a product card to view details.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_slug`: URL slug of the product
- `product_price`: Price of the product
- `source`: Where the click originated (e.g., "homepage", "products_page")

**Location:** `/components/ProductCard.tsx`

### 2. Product Interaction Events

#### `variant_selected`
Triggered when a user selects a product variant (color, size, etc.).

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `variant_type`: Type of variant (e.g., "color", "size")
- `variant_value`: Selected value (e.g., "Blue", "Large")

**Location:** `/page/product/index.tsx`

### 3. Cart Events

#### `add_to_cart`
Triggered when a user adds a product to their cart.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_price`: Price of the product
- `quantity`: Number of items added
- `variants`: Object containing selected variants
- `total_value`: Total value of items added (price × quantity)

**Location:** `/page/product/7 - Buy.tsx`

#### `buy_now_clicked`
Triggered when a user clicks "Buy Now" for direct checkout.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_price`: Price of the product
- `quantity`: Number of items
- `variants`: Object containing selected variants
- `total_value`: Total value (price × quantity)

**Location:** `/page/product/7 - Buy.tsx`

#### `cart_opened`
Triggered when a user opens the shopping cart.

**Properties:**
- `cart_item_count`: Total number of items in cart
- `cart_total_value`: Total value of all items
- `cart_items`: Array of cart items with product details

**Location:** `/components/Cart.tsx`

#### `cart_closed`
Triggered when a user closes the shopping cart.

**Location:** `/components/Cart.tsx`

#### `cart_quantity_updated`
Triggered when a user changes the quantity of an item in the cart.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_price`: Price of the product
- `old_quantity`: Previous quantity
- `new_quantity`: Updated quantity
- `quantity_change`: Difference (new - old)
- `variants`: Object containing selected variants

**Location:** `/components/Cart.tsx`

#### `remove_from_cart`
Triggered when a user removes an item from the cart.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `product_price`: Price of the product
- `quantity`: Number of items removed
- `variants`: Object containing selected variants
- `total_value`: Total value of items removed

**Location:** `/components/Cart.tsx`

### 4. Checkout Events

#### `checkout_initiated`
Triggered when a user lands on the checkout page.

**Properties:**
- `cart_item_count`: Total number of items
- `subtotal`: Subtotal amount
- `shipping`: Shipping cost
- `total`: Total amount
- `has_discount`: Whether a discount is applied
- `discount_amount`: Amount of discount (if applicable)
- `items`: Array of items being checked out

**Location:** `/app/checkout/page.tsx`

#### `payment_started`
Triggered when a user initiates payment (e.g., clicks PayPal button).

**Properties:**
- `payment_method`: Payment method used (e.g., "paypal")
- `total_amount`: Total amount to be charged

**Location:** `/app/checkout/page.tsx`

#### `purchase_completed`
Triggered when a purchase is successfully completed.

**Properties:**
- `order_id`: Unique order identifier
- `cart_item_count`: Total number of items purchased
- `subtotal`: Subtotal amount
- `shipping`: Shipping cost
- `total`: Total amount paid
- `has_discount`: Whether a discount was applied
- `discount_amount`: Amount of discount (if applicable)
- `items`: Array of purchased items

**Location:** `/app/checkout/page.tsx`

#### `$transaction`
PostHog's built-in revenue tracking event.

**Properties:**
- `order_id`: Unique order identifier
- `revenue`: Total revenue amount
- `currency`: Currency code (EUR)

**Location:** `/app/checkout/page.tsx`

### 5. Review Events

#### `review_added`
Triggered when a user successfully submits a product review.

**Properties:**
- `product_id`: Product identifier
- `product_name`: Name of the product
- `rating`: Rating given (0-5)

**Location:** `/components/AddReviewDialog.tsx`

## Utility Functions

All tracking functions are centralized in `/lib/analytics.ts` for easy maintenance and consistency.

### Available Functions:

- `trackProductViewed(product)`
- `trackProductClicked(product, source)`
- `trackVariantSelected(product, variantType, variantValue)`
- `trackAddToCart(product, variants, quantity)`
- `trackBuyNow(product, variants, quantity)`
- `trackRemoveFromCart(item)`
- `trackCartQuantityUpdated(item, oldQuantity, newQuantity)`
- `trackCartOpened(items, totalItems, totalValue)`
- `trackCartClosed()`
- `trackCheckoutInitiated(items, subtotal, shipping, total, hasDiscount, discountAmount)`
- `trackPaymentStarted(paymentMethod, total)`
- `trackPurchaseCompleted(orderId, items, subtotal, shipping, total, hasDiscount, discountAmount)`
- `trackReviewAdded(productId, productName, rating)`

## Analytics Insights

With these events, you can analyze:

### Conversion Funnel
1. Product Views → Product Clicks
2. Product Clicks → Add to Cart
3. Add to Cart → Checkout Initiated
4. Checkout Initiated → Payment Started
5. Payment Started → Purchase Completed

### User Behavior Patterns
- Most viewed products
- Most clicked products by source
- Popular variant combinations
- Cart abandonment rates
- Average cart value
- Products frequently removed from cart
- Time between cart open and checkout

### Revenue Metrics
- Total revenue (via `$transaction` event)
- Average order value
- Revenue by product
- Impact of discounts on conversion
- Revenue by traffic source

### Product Performance
- Products with highest view-to-cart conversion
- Products with highest cart-to-purchase conversion
- Most reviewed products
- Average rating by product

## Best Practices

1. **Event Naming**: All events use snake_case for consistency with PostHog conventions
2. **Property Naming**: Properties also use snake_case
3. **Data Types**: Ensure numeric values (prices, quantities) are sent as numbers, not strings
4. **Error Handling**: Events are tracked asynchronously and won't block user actions if tracking fails
5. **Privacy**: No personally identifiable information (PII) is tracked without user consent

## Future Enhancements

Additional events that could be tracked:
- `search_performed`: When users search for products
- `filter_applied`: When users filter product listings
- `scroll_depth`: How far users scroll on product pages
- `time_on_page`: Time spent on product pages
- `wishlist_added`: When products are added to wishlist
- `coupon_applied`: When discount codes are used
- `newsletter_signup`: When users subscribe to newsletter

## Testing

To verify events are being tracked:
1. Open PostHog dashboard
2. Navigate to "Events" section
3. Perform actions in the application
4. Check that corresponding events appear in PostHog (may take a few seconds)
5. Verify all properties are being sent correctly

## Support

For questions or issues with analytics tracking, refer to:
- PostHog Documentation: https://posthog.com/docs
- This codebase's `/lib/analytics.ts` file
