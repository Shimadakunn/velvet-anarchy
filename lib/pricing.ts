import { CartItem } from "@/store/cartStore";

/**
 * Calculate if the 10% discount applies
 * Discount applies when total quantity of all items > 1
 */
export function shouldApplyDiscount(items: CartItem[]): boolean {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  return totalQuantity > 1;
}

/**
 * Calculate the original subtotal (before discount)
 */
export function calculateOriginalSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Calculate the discounted subtotal (with 10% off if applicable)
 */
export function calculateDiscountedSubtotal(items: CartItem[]): number {
  const original = calculateOriginalSubtotal(items);
  return shouldApplyDiscount(items) ? original * 0.9 : original;
}

/**
 * Calculate shipping cost
 * Free shipping if subtotal >= €100, otherwise €10
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= 100 ? 0 : 10;
}

/**
 * Calculate tax (10% of subtotal)
 */
export function calculateTax(subtotal: number): number {
  return subtotal * 0.1;
}

/**
 * Calculate the discount amount
 */
export function calculateDiscountAmount(items: CartItem[]): number {
  if (!shouldApplyDiscount(items)) return 0;
  const original = calculateOriginalSubtotal(items);
  return original * 0.1; // 10% discount
}

/**
 * Calculate the total price including shipping and tax
 */
export function calculateTotal(items: CartItem[]): number {
  const subtotal = calculateDiscountedSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  return subtotal + shipping + tax;
}

/**
 * Calculate progress towards free shipping (0-100)
 */
export function calculateShippingProgress(subtotal: number): number {
  if (subtotal >= 100) return 100;
  return (subtotal / 100) * 100;
}

/**
 * Calculate amount needed to reach free shipping
 */
export function calculateAmountToFreeShipping(subtotal: number): number {
  if (subtotal >= 100) return 0;
  return 100 - subtotal;
}
