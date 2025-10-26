"use client";

import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";

export default function Home() {
  const products = useQuery(api.products.listActive);
  const heroSlides = useQuery(api.hero.getActiveSlides);

  // Wait for all queries to complete
  if (products === undefined || heroSlides === undefined) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen mb-8">
      {/* <Book /> */}
      <Hero slides={heroSlides} />

      {/* Bottom decorative element */}
      <div className="my-8 text-center">
        <div className="inline-block">
          <div className="flex items-center gap-2">
            <div className="w-12 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 uppercase tracking-widest">
              Products
            </span>
            <div className="w-12 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>

      <div className="md:px-4 md:max-w-[85vw] mx-auto">
        {/* Products Grid */}
        {products === undefined ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products available yet.</p>
        ) : products.length < 4 ? (
          <div className="flex flex-wrap justify-center md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-8 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
