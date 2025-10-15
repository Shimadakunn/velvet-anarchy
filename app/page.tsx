"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const products = useQuery(api.products.list);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Products Grid */}
        {products === undefined ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
