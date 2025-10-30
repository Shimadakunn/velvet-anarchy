"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  calculateAmountToDiscount,
  calculateDiscountAmount,
  calculateDiscountedSubtotal,
  calculateDiscountProgress,
  calculateOriginalSubtotal,
  calculateShipping,
  shouldApplyDiscount,
} from "@/lib/pricing";
import Cadena from "@/public/cadena.svg";
import { useCartStore } from "@/store/cartStore";
import { useDataStore } from "@/store/dataStore";
import { useQuery } from "convex/react";
import { BadgeCheck, BadgePercent, Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentBadges from "./PaymentBadges";
import { Button } from "./ui/button";

export default function Cart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } =
    useCartStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const originalSubtotal = calculateOriginalSubtotal(items);
  const subtotal = calculateDiscountedSubtotal(items);
  const discountAmount = calculateDiscountAmount(items);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} strokeWidth={2.25} />
          </button>
        </div>

        {/* Discount Progress Banner */}
        {items.length > 0 && (
          <div className="bg-black text-white px-4 py-3">
            {calculateOriginalSubtotal(items) < 150 ? (
              <div>
                <div className="flex items-center justify-between text-xs mb-1 -translate-y-0.5">
                  <div className="flex items-center mx-auto gap-1">
                    <span>
                      €
                      {calculateAmountToDiscount(
                        calculateOriginalSubtotal(items)
                      )}{" "}
                      away from 10% off
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${calculateDiscountProgress(calculateOriginalSubtotal(items))}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 text-xs">
                <BadgePercent size={14} />
                <span>You got 10% off your order!</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-2">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-blue-600 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  hasDiscount={shouldApplyDiscount(items)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4">
            {/* Price Breakdown */}
            <div className="space-y-2 py-3 border-y border-gray-200">
              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal · {items.length} items</span>
                <span>€{originalSubtotal.toFixed(2)}</span>
              </div>

              {/* Discount */}
              {shouldApplyDiscount(items) && (
                <div className="flex justify-between text-xs pl-2">
                  <div className="flex items-center gap-1 text-green-700">
                    <BadgeCheck size={14} />
                    <span>Discount (10% off)</span>
                  </div>
                  <span className="text-green-700 font-semibold">
                    -€{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping · 10-25 days</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end py-4">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-extrabold tracking-tighter">
                €{total.toFixed(2)}
              </span>
            </div>

            <Link href="/checkout">
              <Button
                effect="ringHover"
                className="w-full mb-2 relative bg-foreground rounded-none text-background py-3 hover:scale-[1.005] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                onClick={closeCart}
              >
                <Image src={Cadena} alt="Lock" width={14} height={14} />
                <h1 className="text-xl font-black">CHECKOUT</h1>
              </Button>
            </Link>

            {/* Payment Badges */}
            <PaymentBadges className="my-2 px-4" />
            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="flex items-center gap-1">
                Payments are powered by{" "}
                <Image
                  src="/paypal.svg"
                  alt="PayPal"
                  width={16}
                  height={16}
                  className="w-14 h-auto"
                />
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
  hasDiscount,
}: {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  hasDiscount: boolean;
}) {
  const { getVariants, getImageUrl } = useDataStore();

  // Get cached variants only - fetching happens globally in Footer
  const { data: variants } = item.productId
    ? getVariants(item.productId)
    : { data: null };

  // Find variant image if any selected variant has one
  const variantImage = variants?.find((variant) => {
    // Check if this variant matches any of the selected variants
    const selectedValue = item.variants[variant.type];
    return variant.value === selectedValue && variant.image;
  })?.image;

  // Use variant image if available, otherwise use product image
  const imageToDisplay = variantImage || item.productImage;

  // Get cached image URL only - fetching happens via useStorageUrls hook
  const imageUrl = imageToDisplay ? getImageUrl(imageToDisplay) : null;

  // Fallback: fetch if not cached yet
  const fetchedImageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay && !imageUrl
      ? { storageId: imageToDisplay as Id<"_storage"> }
      : "skip"
  );

  const displayImageUrl = imageUrl || fetchedImageUrl;

  const formatVariants = () => {
    return Object.entries(item.variants)
      .filter(([, value]) => value) // Filter out empty/undefined values
      .map(([, value]) => `${value}`)
      .join(" / ");
  };

  return (
    <div className="flex gap-3 border-b border-gray-200 pb-4 relative">
      {/* Product Image */}
      <Link
        href={`/product/${item.productSlug}`}
        className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden"
      >
        {displayImageUrl ? (
          <Image
            width={100}
            height={100}
            src={displayImageUrl}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.productSlug}`}
            className="text-xl font-bold font-Meg hover:underline line-clamp-2"
          >
            {item.productName}
          </Link>
          <p className="font-semibold text-xs text-gray-600 ">
            {formatVariants()}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center ">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="border border-black h-5 w-5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus size={10} strokeWidth={4} />
            </button>
            <span className="text-sm font-bold w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="border border-black h-5 w-5 flex items-center justify-center cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={10} strokeWidth={4} />
            </button>
          </div>

          <div className="flex items-center gap-2 tracking-tighter">
            {hasDiscount ? (
              <>
                <span className="line-through text-gray-400 text-sm">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
                <span className="font-bold text-lg">
                  €{(item.price * item.quantity * 0.9).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg">
                €{(item.price * item.quantity).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1 border border-foreground/50 text-foreground/50 rounded-full absolute top-0 right-0 cursor-pointer"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
