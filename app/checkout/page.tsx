"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  calculateDiscountAmount,
  calculateDiscountedSubtotal,
  calculateOriginalSubtotal,
  calculateShipping,
  shouldApplyDiscount,
} from "@/lib/pricing";
import Cadena from "@/public/cadena-black.svg";
import { CartItem, useCartStore } from "@/store/cartStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

// Component to display individual checkout item with variant image support
function CheckoutItem({
  item,
  hasDiscount,
}: {
  item: CartItem;
  hasDiscount: boolean;
}) {
  // Get all variants for this product
  const variants = useQuery(
    api.variants.get,
    item.productId ? { id: item.productId as Id<"products"> } : "skip"
  );

  // Find variant image if any selected variant has one
  const variantImage = variants?.find((variant) => {
    const selectedValue = item.variants[variant.type];
    return variant.value === selectedValue && variant.images;
  })?.images?.[0];

  // Use variant image if available, otherwise use product image
  const imageToDisplay = variantImage || item.productImage;

  // Get image URL from storage
  const imageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay ? { storageId: imageToDisplay as Id<"_storage"> } : "skip"
  );

  return (
    <div className="flex gap-3 relative">
      {/* Product Image with Quantity Badge */}
      <Link
        href={`/product/${item.productSlug}`}
        className="flex-shrink-0 relative"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.productName}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
        )}
        {/* Quantity Badge */}
        <div className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {item.quantity}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.productSlug}`}
          className="font-medium text-sm text-gray-900 hover:text-gray-700 block truncate uppercase tracking-tight"
        >
          {item.productName}
        </Link>
        <p className="text-xs text-gray-500 mt-1">
          {Object.entries(item.variants)
            .filter(([, v]) => v) // Filter out empty/undefined values
            .map(([, v]) => v)
            .join(" / ")}
        </p>
      </div>

      {/* Price */}
      <div className="text-right shrink-0 mr-1 tracking-tight font-normal">
        {hasDiscount ? (
          <div className="flex flex-col">
            <p className="line-through text-gray-400">
              €{item.price * item.quantity}
            </p>
            <p>€{item.price * item.quantity * 0.9}</p>
          </div>
        ) : (
          <p>€{item.price * item.quantity}</p>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const createOrder = useMutation(api.orders.create);
  const updateInventory = useMutation(api.products.updateInventory);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const originalSubtotal = calculateOriginalSubtotal(items);
  const subtotal = calculateDiscountedSubtotal(items);
  const discountAmount = calculateDiscountAmount(items);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to checkout.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePayPalApprove = async (_data: any, actions: any) => {
    try {
      // Show processing overlay
      setIsProcessing(true);

      // Capture the payment
      const details = await actions.order.capture();

      // Extract shipping address from PayPal
      const paypalShipping = details.purchase_units[0].shipping;
      const shippingAddress = {
        name: paypalShipping.name.full_name,
        addressLine1: paypalShipping.address.address_line_1 || "",
        addressLine2: paypalShipping.address.address_line_2,
        city: paypalShipping.address.admin_area_2 || "",
        state: paypalShipping.address.admin_area_1 || "",
        postalCode: paypalShipping.address.postal_code || "",
        country: paypalShipping.address.country_code || "",
      };

      const customerEmail = details.payer.email_address;
      const customerName = `${details.payer.name.given_name} ${details.payer.name.surname}`;
      const orderId = details.id;

      // Prepare order items
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        variants: item.variants,
      }));

      // Execute everything in parallel: create order, send emails, update inventory
      await Promise.all([
        // Create order in database
        createOrder({
          orderId,
          customerEmail,
          customerName,
          items: orderItems,
          subtotal,
          shipping,
          tax: 0,
          total,
          status: "pending",
          shippingStatus: "pending",
          shippingAddress,
        }),

        // Send confirmation email to customer
        fetch("/api/send-customer-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail,
            customerName,
            orderId,
            shippingStatus: "pending",
            items: orderItems,
            subtotal,
            shipping,
            tax: 0,
            total,
          }),
        }).catch((error) => {
          console.error("Error sending customer confirmation email:", error);
        }),

        // Send admin notification email
        fetch("/api/send-admin-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail,
            customerName,
            orderId,
            items: orderItems,
            subtotal,
            shipping,
            tax: 0,
            total,
            shippingAddress,
          }),
        }).catch((error) => {
          console.error("Error sending admin notification email:", error);
        }),

        // Update inventory for each product
        ...items.map((item) =>
          updateInventory({
            productId: item.productId as Id<"products">,
            quantitySold: item.quantity,
          }).catch((error) => {
            console.error(
              `Error updating inventory for product ${item.productId}:`,
              error
            );
          })
        ),
      ]);

      // Clear cart
      clearCart();

      // Show success message
      toast.success("Payment successful! Order has been placed.");

      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Payment Method */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Payment & Delivery</h2>
              <p className="text-sm text-gray-500 mb-6">
                Please provide your payment information and delivery address.
              </p>

              {/* PayPal Buttons */}
              <div className="">
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal",
                    height: 55,
                  }}
                  createOrder={(_data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "EUR",
                            value: total.toFixed(2),
                            breakdown: {
                              item_total: {
                                currency_code: "EUR",
                                value: subtotal.toFixed(2),
                              },
                              shipping: {
                                currency_code: "EUR",
                                value: shipping.toFixed(2),
                              },
                            },
                          },
                          items: items.map((item) => ({
                            name: item.productName,
                            description: `${Object.entries(item.variants)
                              .filter(([, v]) => v) // Filter out empty/undefined values
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}`,
                            unit_amount: {
                              currency_code: "EUR",
                              value: shouldApplyDiscount(items)
                                ? (item.price * 0.9).toFixed(2)
                                : item.price.toFixed(2),
                            },
                            quantity: item.quantity.toString(),
                          })),
                        },
                      ],
                    });
                  }}
                  onApprove={handlePayPalApprove}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    toast.error("Payment failed. Please try again.");
                  }}
                />
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Image
                  src={Cadena}
                  alt="Secure Transaction"
                  width={10}
                  height={10}
                />
                <span> All transactions are secure and encrypted.</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-4 pt-2 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <CheckoutItem
                    key={item.id}
                    item={item}
                    hasDiscount={shouldApplyDiscount(items)}
                  />
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 py-2 border-y border-gray-200 text-xs">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal · {items.length} items</span>
                  <span>€{originalSubtotal}</span>
                </div>

                {/* Discount */}
                {shouldApplyDiscount(items) && (
                  <div className="flex justify-between pl-2">
                    <div className="flex items-center gap-1 text-green-700">
                      <BadgeCheck size={14} />
                      <span>Discount (10% off)</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      -€{discountAmount}
                    </span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping · 10-25 days</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-3 text-lg">
                <span>Total</span>
                <span className=" tracking-tighter">€{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              {/* Animated Icon */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto">
                  <div className="w-full h-full border-4 border-green-200 rounded-full animate-ping opacity-20" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Processing Your Order
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                Please wait while we save your order. This will only take a
                moment...
              </p>

              {/* Progress Steps */}
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Payment captured successfully
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Loader2 className="w-5 h-5 text-green-600 animate-spin flex-shrink-0" />
                  <span className="text-gray-700">Saving order details...</span>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  Please do not close this window or press the back button.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
