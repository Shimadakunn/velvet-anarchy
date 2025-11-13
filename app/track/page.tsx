"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Home,
  Mail,
  MapPin,
  Navigation,
  Package,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  Search,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Order item component
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
  const variants = useQuery(
    api.variants.get,
    item.productId ? { id: item.productId as Id<"products"> } : "skip"
  );

  const variantImage = variants?.find((variant) => {
    const selectedValue =
      item.variants[variant.type as keyof typeof item.variants];
    return variant.value === selectedValue && variant.images;
  })?.images?.[0];

  const imageToDisplay = variantImage || item.productImage;

  const imageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay ? { storageId: imageToDisplay as Id<"_storage"> } : "skip"
  );

  return (
    <div className="flex gap-4 py-3 border-b border-gray-200 last:border-0">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={item.productName}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
      )}

      <div className="flex-1">
        <h4 className="font-semibold text-sm">{item.productName}</h4>
        <p className="text-xs text-gray-600 mt-1">
          {Object.entries(item.variants)
            .filter(([, value]) => value) // Filter out empty/undefined values
            .map(([, value]) => value)
            .join(" / ")}
        </p>
        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-sm">€{item.price * item.quantity}</p>
        <p className="text-xs text-gray-500">€{item.price} each</p>
      </div>
    </div>
  );
}

// Shipping progress tracker
function ShippingProgress({
  shippingStatus,
}: {
  shippingStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered";
}) {
  const steps = [
    { id: "pending", label: "Pending", icon: Clock },
    { id: "processing", label: "Processing", icon: PackageSearch },
    { id: "shipped", label: "Shipped", icon: PackageCheck },
    { id: "in_transit", label: "In Transit", icon: Navigation },
    { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
  ];

  const currentIndex = steps.findIndex((step) => step.id === shippingStatus);

  return (
    <div className="py-8">
      <div className="relative md:px-4">
        <div className="flex items-start justify-between relative">
          {/* Progress Line - positioned to go through center of circles */}
          <div className="absolute left-5 right-5 top-[20px] h-1 bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? isCurrent
                        ? "bg-green-500 ring-4 ring-green-100"
                        : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-[8px] md:text-xs font-medium text-center leading-tight mt-1 max-w-[50px] md:max-w-none md:whitespace-nowrap ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Detect if input is an email (contains @ and looks like an email)
  const isEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const searchType = activeSearch
    ? isEmail(activeSearch)
      ? "email"
      : "orderId"
    : null;

  const orderById = useQuery(
    api.orders.getByOrderId,
    searchType === "orderId" ? { orderId: activeSearch } : "skip"
  );

  const ordersByEmail = useQuery(
    api.orders.getByEmail,
    searchType === "email" ? { email: activeSearch } : "skip"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = searchInput.trim();
    setActiveSearch(trimmedInput);
    setIsSearching(true);
  };

  // Determine what to display
  const orders =
    searchType === "email" ? ordersByEmail : orderById ? [orderById] : null;
  const hasSearched = !!activeSearch;

  // Stop loading when query completes
  useEffect(() => {
    if (isSearching) {
      if (searchType === "orderId" && orderById !== undefined) {
        setIsSearching(false);
      } else if (searchType === "email" && ordersByEmail !== undefined) {
        setIsSearching(false);
      }
    }
  }, [isSearching, searchType, orderById, ordersByEmail]);

  const formatOrderDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        label: "Pending",
      },
      shipping: {
        icon: Truck,
        color: "bg-blue-100 text-blue-800 border-blue-300",
        label: "Shipping",
      },
      completed: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-300",
        label: "Completed",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-red-100 text-red-800 border-red-300",
        label: "Cancelled",
      },
      refunded: {
        icon: RotateCcw,
        color: "bg-purple-100 text-purple-800 border-purple-300",
        label: "Refunded",
      },
    };
    return configs[status as keyof typeof configs];
  };

  return (
    <div className="md;bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center md:mb-8 mb-4">
          <div className="flex justify-center md:mb-4 mb-2">
            <MapPin className="md:w-16 md:h-16 w-12 h-12 text-gray-700" />
          </div>
          <h1 className="md:text-4xl text-3xl font-bold md:mb-3 mb-1">
            Track Your Order
          </h1>
          <p className="text-gray-600 md:text-lg text-base">
            Enter your order ID or email to view your order status and shipping
            details
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg md:shadow-sm p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter order ID or email address"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Track"}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            We&apos;ll automatically detect whether you entered an order ID or
            email address
          </p>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Searching...</h3>
            <p className="text-gray-600">
              Looking for your {searchType === "email" ? "orders" : "order"}
            </p>
          </div>
        )}

        {/* Order Not Found */}
        {!isSearching && hasSearched && (!orders || orders.length === 0) && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchType === "orderId" ? (
                <>
                  We couldn&apos;t find an order with ID:{" "}
                  <span className="font-mono font-semibold">
                    {activeSearch}
                  </span>
                </>
              ) : (
                <>
                  We couldn&apos;t find any orders for:{" "}
                  <span className="font-semibold">{activeSearch}</span>
                </>
              )}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please check your{" "}
              {searchType === "orderId" ? "order ID" : "email address"} and try
              again
            </p>
          </div>
        )}

        {/* Results Header for Email Search */}
        {!isSearching &&
          searchType === "email" &&
          orders &&
          orders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"} Found
              </h2>
              <p className="text-gray-600">
                Showing all orders for{" "}
                <span className="font-semibold">{activeSearch}</span>
              </p>
            </div>
          )}

        {/* Order Details */}
        {!isSearching && orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="space-y-6 pb-8 border-b-4 border-gray-200 last:border-0 last:pb-0"
              >
                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span className="font-mono text-sm font-semibold">
                          {order.orderId}
                        </span>
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const config = getStatusConfig(order.status);
                        const Icon = config.icon;
                        return (
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${config.color}`}
                          >
                            <Icon className="w-4 h-4" />
                            {config.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Order Date</p>
                        <p className="font-medium">
                          {formatOrderDate(order._creationTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium truncate">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Progress */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold md:mb-4">
                    Shipping Status
                  </h3>
                  <ShippingProgress shippingStatus={order.shippingStatus} />
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">
                          {order.shippingAddress.name}
                        </p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p className="uppercase">
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <OrderItem key={index} item={item} />
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>€{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>
                        {order.shipping === 0 ? "FREE" : `€${order.shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span>€{order.tax}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>€{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-blue-900">Need Help?</h3>
              <p className="text-blue-800 text-sm">
                If you have any questions about your order, please contact our
                customer support team.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
