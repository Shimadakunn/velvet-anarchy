"use client";

import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Home,
  Mail,
  Navigation,
  Package,
  PackageCheck,
  PackageSearch,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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

  const selectedVariant = variants?.find((variant) => {
    const selectedValue =
      item.variants[variant.type as keyof typeof item.variants];
    return variant.value === selectedValue && variant.type === "color";
  });

  const variantImage = variants?.find((variant) => {
    const selectedValue =
      item.variants[variant.type as keyof typeof item.variants];
    return variant.value === selectedValue && variant.images;
  })?.images?.[0];

  const imageToDisplay = variantImage || item.productImage;
  const variantLink = selectedVariant?.variantLink;

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
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-600 mt-0.5">
            {Object.entries(item.variants)
              .filter(([, value]) => value) // Filter out empty/undefined values
              .map(([, value]) => value)
              .join(" / ")}
          </p>
          {variantLink && (
            <a
              href={variantLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              title="View variant product"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          €{item.price} x {item.quantity}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-sm">€{item.price * item.quantity}</p>
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
    shippingAddress?: {
      name: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    chinaOrderId?: string;
  };
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [selectedShippingStatus, setSelectedShippingStatus] = useState(
    order.shippingStatus
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chinaOrderIdInput, setChinaOrderIdInput] = useState(
    order.chinaOrderId || ""
  );
  const updateStatus = useMutation(api.orders.updateStatus);
  const updateShippingStatus = useMutation(api.orders.updateShippingStatus);
  const updateChinaOrderId = useMutation(api.orders.updateChinaOrderId);

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
      toast.success(
        `Shipping status updated to ${newStatus.replace("_", " ")}`
      );
    } catch (error) {
      console.error("Failed to update shipping status:", error);
      toast.error("Failed to update shipping status");
    }
  };

  const handleSendShippingEmail = async () => {
    try {
      const response = await fetch("/api/send-customer-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          orderId: order.orderId,
          shippingStatus: selectedShippingStatus,
          items: order.items,
          shippingAddress: order.shippingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success("Shipping status email sent successfully!");
    } catch (error) {
      console.error("Failed to send shipping email:", error);
      toast.error("Failed to send shipping status email");
    }
  };

  const handleSaveChinaOrderId = async () => {
    try {
      await updateChinaOrderId({
        orderId: order.orderId,
        chinaOrderId: chinaOrderIdInput,
      });
      toast.success("China Order ID updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update China Order ID:", error);
      toast.error("Failed to update China Order ID");
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
      <div className="p-4 border-b border-gray-200 flex flex-row gap-4">
        <div className="flex items-center gap-1">
          <Package className="w-4 h-4" />
          <span className="text-sm font-semibold">{order.orderId}</span>
        </div>
        {order.chinaOrderId ? (
          <div className="flex items-center gap-1">
            🇨🇳
            <span className="text-sm font-semibold">{order.chinaOrderId}</span>
          </div>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Add China Order ID"
              >
                <Plus className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>China Order ID</DialogTitle>
                <DialogDescription>
                  Add or update the China Order ID for this order.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <input
                  type="text"
                  value={chinaOrderIdInput}
                  onChange={(e) => setChinaOrderIdInput(e.target.value)}
                  placeholder="Enter China Order ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <DialogFooter>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChinaOrderId}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="text-sm">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{order.customerEmail}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{orderDate}</span>
        </div>
        <div className="flex-1" />
        <span className="text-lg font-bold">€{order.total}</span>
      </div>

      {/* Status and Shipping Status */}
      <div className="p-4 flex flex-row gap-4 pb-0">
        {/* Order Status */}
        <div className="flex-1">
          <div className="flex flex-row justify-between items-end mb-2">
            <label className="block text-xs font-medium text-gray-700">
              Order Status
            </label>
            <StatusBadge status={selectedStatus} />
          </div>

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
        <div className="w-px bg-gray-400" />
        {/* Shipping Status */}
        <div className="flex-1">
          <div className="flex flex-row justify-between items-end mb-2">
            <label className="block text-xs font-medium text-gray-700">
              Shipping Status
            </label>
            <ShippingStatusBadge status={selectedShippingStatus} />
          </div>
          <div className="flex flex-row justify-between">
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
              className=" px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              onClick={handleSendShippingEmail}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors "
            >
              <Mail className="w-4 h-4" />
              Send Shipping Status Email to Customer
            </button>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 pt-2 text-sm font-medium text-gray-700 hover:text-black transition pb-4"
      >
        {isExpanded ? "Hide Details" : "View Details"}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-row gap-4">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="flex-1 ">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Truck className="w-4 h-4 text-gray-600" />
                Shipping Address
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {order.shippingAddress.name}
                </p>
                <p>
                  <span className="font-semibold">Address Line 1:</span>{" "}
                  {order.shippingAddress.addressLine1}
                </p>
                {order.shippingAddress.addressLine2 && (
                  <p>
                    <span className="font-semibold">Address Line 2:</span>{" "}
                    {order.shippingAddress.addressLine2}
                  </p>
                )}
                <p>
                  <span className="font-semibold">City:</span>{" "}
                  {order.shippingAddress.city}
                </p>
                <p>
                  <span className="font-semibold">State:</span>{" "}
                  {order.shippingAddress.state}
                </p>
                <p>
                  <span className="font-semibold">Postal Code:</span>{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>
                  <span className="font-semibold">Country:</span>{" "}
                  <span className="uppercase">
                    {order.shippingAddress.country}
                  </span>
                </p>
              </div>
            </div>
          )}
          <div className="w-px bg-gray-400" />
          <div className="flex-1">
            {/* Items List */}
            <h4 className="text-sm font-semibold ">Order Items</h4>
            <div className="space-y-2 mb-1">
              {order.items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 text-sm space-y-1 pt-2">
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
              <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-300">
                <span>Total</span>
                <span>€{order.total}</span>
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
          .filter(
            (o) =>
              o.status === "completed" ||
              o.status === "shipping" ||
              o.status === "pending"
          )
          .reduce((sum, o) => sum + o.total, 0),
      }
    : null;

  if (!orders) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
              <p className="text-xs text-emerald-800 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-emerald-900">
                €{stats.revenue}
              </p>
            </div>
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
