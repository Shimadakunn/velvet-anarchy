"use client";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { useDataStore } from "@/store/dataStore";

export default function Home() {
  const { getProducts, getHeroSlides } = useDataStore();

  // Get data from cache only - fetching happens globally in Footer
  const { data: products } = getProducts();
  const { data: heroSlides } = getHeroSlides();

  return (
    <div className="min-h-screen mb-8">
      {heroSlides && <Hero slides={heroSlides} />}

      {/* Bottom decorative element */}
      <div className="my-4 text-center">
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

      {products && (
        <div className="md:px-4 md:max-w-[85vw] mx-auto">
          {/* Products Grid */}
          {products.length === 0 ? (
            <p className="text-gray-500">No products available yet.</p>
          ) : products.length < 4 ? (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
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
      )}
    </div>
  );
}
