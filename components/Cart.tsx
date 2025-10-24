"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { X, Minus, Plus, Trash2, BadgeCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import PaymentBadges from "./PaymentBadges";

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-300 p-4">
            {/* Total */}
            <div className="flex justify-between items-center text-2xl font-black mb-2">
              <span>Total</span>
              <span>€{getTotalPrice().toFixed(2)}</span>
            </div>

            <Link href="/checkout">
              <Button
                effect="ringHover"
                className="w-full my-2 relative bg-foreground text-background py-3 rounded-lg hover:scale-[1.005] active:scale-[0.98] transition-all duration-200"
                onClick={closeCart}
              >
                <Lock
                  style={{ width: "16px", height: "16px" }}
                  strokeWidth={2.5}
                />
                <h1 className="text-xl font-semibold">Proceed to Checkout</h1>
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
}: {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  // Get all variants for this product
  const variants = useQuery(
    api.variants.get,
    item.productId ? { id: item.productId as Id<"products"> } : "skip"
  );

  // Find variant image if any selected variant has one
  const variantImage = variants?.find((variant) => {
    // Check if this variant matches any of the selected variants
    const selectedValue = item.variants[variant.type];
    return variant.value === selectedValue && variant.image;
  })?.image;

  // Use variant image if available, otherwise use product image
  const imageToDisplay = variantImage || item.productImage;

  // Get image URL from storage
  const imageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay ? { storageId: imageToDisplay as Id<"_storage"> } : "skip"
  );

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
        {imageUrl ? (
          <Image
            width={100}
            height={100}
            src={imageUrl}
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
            className="text-xl font-bold font-Dirty hover:underline line-clamp-2"
          >
            {item.productName}
          </Link>
          {item.quantity > 1 && <p className="font-bold ">{item.price} €</p>}
          <p className="font-semibold text-xs text-gray-600 ">
            {formatVariants()}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1 border border-foreground/50 text-foreground/50 rounded-full absolute top-0 right-0"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
