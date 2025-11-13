"use client";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminPage() {
  const products = useQuery(api.products.list);
  const orders = useQuery(api.orders.list);
  const hero = useQuery(api.hero.getAllSlides);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white h-full rounded-lg shadow-xs p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <p className="text-xs text-purple-800 mb-1">Hero</p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-bold text-purple-900">
                {hero?.length}
              </p>
              <Link
                href="/hero"
                className="text-xs text-purple-400 hover:text-purple-500 transition-colors underline"
              >
                View
              </Link>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-xs text-yellow-800 mb-1">Products</p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-bold text-yellow-900">
                {products?.length}
              </p>
              <Link
                href="/products"
                className="text-xs text-yellow-400 hover:text-yellow-500 transition-colors underline"
              >
                View
              </Link>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <p className="text-xs text-blue-800 mb-1">Orders</p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-bold text-blue-900">
                {orders?.length}
              </p>
              <Link
                href="/orders"
                className="text-xs text-blue-400 hover:text-blue-500 transition-colors underline"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
