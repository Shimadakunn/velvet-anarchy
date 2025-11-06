# PostHog Shopping Behavior Tracking Implementation

## Overview
This document describes the comprehensive PostHog analytics tracking implementation for monitoring user shopping behavior throughout the e-commerce funnel.

## Tracking Events Implemented

### 1. Product Discovery Events

#### `product_viewed`
**Location:** `app/product/[slug]/page.tsx`
**Triggered when:** User views a product detail page
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `product_price`: Product price
- `product_slug`: Product URL slug
- `product_rating`: Product rating
- `product_stock`: Available stock
- `currency`: EUR

#### `product_list_viewed`
**Location:** `app/page.tsx`
**Triggered when:** User views the homepage product list
**Properties tracked:**
- `product_count`: Number of products displayed
- `products`: Array of product details (id, name, price)

#### `product_clicked`
**Location:** `components/ProductCard.tsx`
**Triggered when:** User clicks on a product card
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `product_price`: Product price
- `position`: Position in list (optional)
- `list_name`: Name of the list (default: "product_list")
- `currency`: EUR

### 2. Cart Events

#### `product_added_to_cart`
**Location:** `store/cartStore.ts` (addItem action)
**Triggered when:** User adds a product to cart
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `product_price`: Product price
- `quantity`: Quantity added
- `variants`: Selected variants (color, size, etc.)
- `cart_value`: Total value of items added (price × quantity)
- `currency`: EUR

#### `product_removed_from_cart`
**Location:** `store/cartStore.ts` (removeItem action)
**Triggered when:** User removes a product from cart
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `product_price`: Product price
- `quantity`: Quantity removed
- `variants`: Product variants
- `cart_value`: Value of items removed
- `currency`: EUR

#### `cart_quantity_updated`
**Location:** `store/cartStore.ts` (updateQuantity action)
**Triggered when:** User changes quantity in cart
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `old_quantity`: Previous quantity
- `new_quantity`: Updated quantity
- `quantity_change`: Difference (new - old)
- `product_price`: Product price
- `currency`: EUR

#### `cart_viewed`
**Location:** `components/Cart.tsx`
**Triggered when:** User opens the cart sidebar
**Properties tracked:**
- `cart_total`: Total cart value
- `cart_item_count`: Total number of items
- `cart_unique_products`: Number of unique products
- `currency`: EUR
- `products`: Array of cart items with details

### 3. Product Interaction Events

#### `variant_selected`
**Location:** `page/product/6 - Variants.tsx`
**Triggered when:** User selects a product variant (color, size, etc.)
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `variant_type`: Type of variant (e.g., "color", "size")
- `variant_value`: Selected value (e.g., "Blue", "Large")

#### `quantity_changed`
**Location:** `page/product/5 - Quantity.tsx`
**Triggered when:** User changes quantity on product page
**Properties tracked:**
- `product_id`: Product identifier
- `product_name`: Product name
- `old_quantity`: Previous quantity
- `new_quantity`: Updated quantity
- `quantity_change`: Difference (new - old)

### 4. Checkout Events

#### `checkout_started`
**Location:** `app/checkout/page.tsx`
**Triggered when:** User lands on checkout page
**Properties tracked:**
- `cart_total`: Total order value
- `cart_subtotal`: Subtotal before shipping
- `shipping_cost`: Shipping cost
- `discount_applied`: Boolean indicating if discount is active
- `discount_amount`: Discount amount (if applicable)
- `item_count`: Total number of items
- `unique_products`: Number of unique products
- `currency`: EUR
- `products`: Array of products with details

### 5. Purchase Events

#### `purchase_completed`
**Location:** `app/checkout/page.tsx` (handlePayPalApprove)
**Triggered when:** Payment is successfully completed
**Properties tracked:**
- `order_id`: PayPal order ID
- `revenue`: Total order value
- `subtotal`: Order subtotal
- `shipping`: Shipping cost
- `discount_amount`: Applied discount
- `currency`: EUR
- `item_count`: Total items purchased
- `unique_products`: Number of unique products
- `products`: Array with product details and revenue per item

**Additional actions:**
- Sets user properties: `last_purchase_date`, `last_purchase_amount`
- Increments: `lifetime_purchases`, `lifetime_revenue`
- Identifies user by email

#### `order_viewed`
**Location:** `app/order-success/page.tsx`
**Triggered when:** User views order confirmation page
**Properties tracked:**
- `order_id`: Order identifier
- `order_total`: Total order value
- `item_count`: Number of items
- `currency`: EUR

### 6. Engagement Events

#### `review_submitted`
**Location:** `components/AddReviewDialog.tsx`
**Triggered when:** User submits a product review
**Properties tracked:**
- `product_id`: Product identifier
- `rating`: Review rating (0.5 to 5)
- `has_comment`: Boolean indicating if review has text
- `has_images`: Boolean indicating if review has images
- `image_count`: Number of images uploaded

## User Identification

### `identifyUser()`
**Location:** Called in `app/checkout/page.tsx` after purchase
**Purpose:** Associates anonymous events with identified user
**Properties set:**
- Email (as identifier)
- Name
- Last order ID

## Analytics Utility Module

**File:** `lib/analytics.ts`

This module provides:
- Type-safe event tracking functions
- Consistent event naming
- Centralized tracking logic
- Easy maintenance and updates

### Key Features:
- All tracking functions are strongly typed
- Consistent property naming across events
- Currency always set to EUR
- Automatic user property updates on purchase
- Lifetime value tracking

## E-commerce Funnel Coverage

The implementation tracks the complete shopping journey:

1. **Discovery** → Product list view, product clicks
2. **Consideration** → Product views, variant selection, quantity changes
3. **Intent** → Add to cart, cart views, cart modifications
4. **Purchase** → Checkout start, payment completion
5. **Post-Purchase** → Order confirmation, review submission

## Key Metrics Available

With this tracking implementation, you can analyze:

### Conversion Metrics
- Product view → Add to cart rate
- Cart view → Checkout rate
- Checkout → Purchase completion rate
- Overall conversion funnel

### Product Performance
- Most viewed products
- Most added to cart
- Most purchased products
- Products with highest cart abandonment
- Average order value per product

### User Behavior
- Variant preferences (colors, sizes)
- Average cart value
- Average items per order
- Time to purchase
- Cart abandonment patterns

### Revenue Metrics
- Total revenue
- Revenue per user
- Lifetime value
- Discount impact on conversion
- Average order value

### Engagement Metrics
- Review submission rate
- Products with most reviews
- Average rating per product
- Cart interaction patterns

## Usage Examples

### Viewing Events in PostHog
All events are automatically sent to PostHog with the configured API key. You can:

1. View real-time events in the PostHog dashboard
2. Create funnels to analyze conversion rates
3. Build cohorts based on shopping behavior
4. Set up retention analysis
5. Create custom dashboards

### Sample Funnel Analysis
```
Product Viewed → Product Added to Cart → Checkout Started → Purchase Completed
```

### Sample User Properties
After purchase, users will have:
- `last_purchase_date`
- `last_purchase_amount`
- `lifetime_purchases` (incremented)
- `lifetime_revenue` (incremented)

## Technical Implementation Details

### Event Tracking Pattern
```typescript
import { trackEventName } from "@/lib/analytics";

// Track event with properties
trackEventName({
  property1: value1,
  property2: value2,
});
```

### State Management Integration
Cart tracking is integrated directly into Zustand store actions, ensuring:
- All cart modifications are tracked
- No duplicate tracking
- Accurate quantity tracking
- Proper variant tracking

### React Component Integration
Product interaction tracking uses React hooks:
- `useEffect` for page views
- Event handlers for user interactions
- Proper dependency arrays to prevent duplicate events

## Environment Variables Required

The PostHog setup requires:
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog instance URL

These are configured in `instrumentation-client.ts`.

## Best Practices Followed

1. **Event Naming**: Consistent snake_case naming convention
2. **Property Naming**: Descriptive, consistent property names
3. **Currency**: Always included for monetary values
4. **User Identification**: Implemented after purchase
5. **Privacy**: No sensitive data (passwords, full payment info) tracked
6. **Performance**: Tracking doesn't block UI interactions
7. **Type Safety**: Full TypeScript support for all tracking functions

## Future Enhancement Opportunities

1. **A/B Testing**: Track experiment variants
2. **Search Tracking**: Add search query tracking
3. **Filter Tracking**: Track product filter usage
4. **Wishlist**: Track wishlist additions
5. **Share Events**: Track product shares
6. **Error Tracking**: Track checkout errors
7. **Performance**: Track page load times
8. **Session Recording**: Enable PostHog session replay

## Maintenance

To add new tracking events:

1. Add event constant to `AnalyticsEvents` in `lib/analytics.ts`
2. Create tracking function with proper TypeScript types
3. Import and call tracking function at appropriate location
4. Document the event in this file

## Testing

To verify tracking is working:

1. Open PostHog dashboard
2. Navigate to "Events" or "Live Events"
3. Perform actions in the application
4. Verify events appear with correct properties
5. Check user properties are updated correctly

## Support

For issues or questions about the tracking implementation:
- Review PostHog documentation: https://posthog.com/docs
- Check the `lib/analytics.ts` file for available tracking functions
- Verify environment variables are set correctly
