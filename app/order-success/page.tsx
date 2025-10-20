"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package, Mail, ArrowLeft } from "lucide-react";

// Component to display individual order item with variant image support
function OrderItem({
  item,
}: {
  item: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    variants: { color: string; size: string };
  };
}) {
  // Get all variants for this product
  const variants = useQuery(
    api.variants.get,
    item.productId ? { id: item.productId as Id<"products"> } : "skip"
  );

  // Find variant image if any selected variant has one
  const variantImage = variants?.find((variant) => {
    const selectedValue =
      item.variants[variant.type as keyof typeof item.variants];
    return variant.value === selectedValue && variant.image;
  })?.image;

  // Use variant image if available, otherwise use product image
  const imageToDisplay = variantImage || item.productImage;

  // Get image URL from storage
  const imageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay ? { storageId: imageToDisplay as Id<"_storage"> } : "skip"
  );

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg">
      {/* Product Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={item.productName}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-lg"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
      )}

      {/* Product Info */}
      <div className="flex-1">
        <h4 className="font-semibold">{item.productName}</h4>
        <div className="flex gap-3 mt-1 text-sm text-gray-600">
          <span className="capitalize">
            Color: <span className="font-medium">{item.variants.color}</span>
          </span>
          <span className="capitalize">
            Size: <span className="font-medium">{item.variants.size}</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const order = useQuery(
    api.orders.getByPaypalOrderId,
    orderId ? { paypalOrderId: orderId } : "skip"
  );

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Order</h1>
          <p className="text-gray-600 mb-6">No order ID was provided.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                Order ID: <span className="font-mono font-semibold">{order.orderId}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                Confirmation sent to <span className="font-semibold">{order.customerEmail}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2 text-blue-900">What's Next?</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>✓ You will receive an order confirmation email shortly</li>
            <li>✓ We'll send you shipping updates as your order is processed</li>
            <li>✓ Your order will be delivered within 5-7 business days</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 text-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 text-center border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
