"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { useState } from "react";
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  User,
  Calendar,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Truck,
  PackageCheck,
  PackageSearch,
  Navigation,
  Home,
} from "lucide-react";
import { toast } from "sonner";

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
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

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

// Shipping status badge component
function ShippingStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "bg-gray-100 text-gray-800 border-gray-300",
      label: "Pending",
    },
    processing: {
      icon: PackageSearch,
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      label: "Processing",
    },
    shipped: {
      icon: PackageCheck,
      color: "bg-blue-100 text-blue-800 border-blue-300",
      label: "Shipped",
    },
    in_transit: {
      icon: Navigation,
      color: "bg-indigo-100 text-indigo-800 border-indigo-300",
      label: "In Transit",
    },
    out_for_delivery: {
      icon: Truck,
      color: "bg-cyan-100 text-cyan-800 border-cyan-300",
      label: "Out for Delivery",
    },
    delivered: {
      icon: Home,
      color: "bg-green-100 text-green-800 border-green-300",
      label: "Delivered",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

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
    return variant.value === selectedValue && variant.image;
  })?.image;

  const imageToDisplay = variantImage || item.productImage;

  const imageUrl = useQuery(
    api.files.getUrl,
    imageToDisplay ? { storageId: imageToDisplay as Id<"_storage"> } : "skip"
  );

  return (
    <div className="flex gap-3 py-2">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={item.productName}
          width={60}
          height={60}
          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{item.productName}</h4>
        <p className="text-xs text-gray-600 mt-0.5">
          {item.variants.color} / {item.variants.size}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-sm">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

// Individual order card
function OrderCard({
  order,
}: {
  order: {
    _id: Id<"orders">;
    _creationTime: number;
    orderId: string;
    customerEmail: string;
    customerName: string;
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      price: number;
      quantity: number;
      variants: { color: string; size: string };
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: "pending" | "shipping" | "completed" | "cancelled" | "refunded";
    shippingStatus:
      | "pending"
      | "processing"
      | "shipped"
      | "in_transit"
      | "out_for_delivery"
      | "delivered";
  };
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [selectedShippingStatus, setSelectedShippingStatus] = useState(
    order.shippingStatus
  );
  const updateStatus = useMutation(api.orders.updateStatus);
  const updateShippingStatus = useMutation(api.orders.updateShippingStatus);

  const handleStatusChange = async (
    newStatus: "pending" | "shipping" | "completed" | "cancelled" | "refunded"
  ) => {
    try {
      await updateStatus({
        orderId: order.orderId,
        status: newStatus,
      });
      setSelectedStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleShippingStatusChange = async (
    newStatus:
      | "pending"
      | "processing"
      | "shipped"
      | "in_transit"
      | "out_for_delivery"
      | "delivered"
  ) => {
    try {
      await updateShippingStatus({
        orderId: order.orderId,
        shippingStatus: newStatus,
      });
      setSelectedShippingStatus(newStatus);
      toast.success(`Shipping status updated to ${newStatus.replace("_", " ")}`);
    } catch (error) {
      console.error("Failed to update shipping status:", error);
      toast.error("Failed to update shipping status");
    }
  };

  const orderDate = new Date(order._creationTime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="font-mono text-sm font-semibold">
                {order.orderId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{orderDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <StatusBadge status={selectedStatus} />
            <ShippingStatusBadge status={selectedShippingStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="truncate">{order.customerEmail}</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-700" />
            <span className="text-lg font-bold">{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Status Update Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as
                    | "pending"
                    | "shipping"
                    | "completed"
                    | "cancelled"
                    | "refunded"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="shipping">Shipping</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Shipping Status
            </label>
            <select
              value={selectedShippingStatus}
              onChange={(e) =>
                handleShippingStatusChange(
                  e.target.value as
                    | "pending"
                    | "processing"
                    | "shipped"
                    | "in_transit"
                    | "out_for_delivery"
                    | "delivered"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
        >
          {isExpanded ? "Hide Details" : "View Details"}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {/* Items List */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 text-sm">
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
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter orders based on search and status
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = orders
    ? {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        shipping: orders.filter((o) => o.status === "shipping").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
        refunded: orders.filter((o) => o.status === "refunded").length,
        revenue: orders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.total, 0),
      }
    : null;

  if (!orders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600">
            View and manage all customer orders from your store
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <p className="text-xs text-yellow-800 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.pending}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-xs text-blue-800 mb-1">Shipping</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.shipping}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-xs text-green-800 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.completed}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-xs text-red-800 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-900">
                {stats.cancelled}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <p className="text-xs text-purple-800 mb-1">Refunded</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.refunded}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
              <p className="text-xs text-emerald-800 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-emerald-900">
                ${stats.revenue.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shipping">Shipping</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredOrders?.length || 0} of {orders.length} orders
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here once customers make purchases"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
