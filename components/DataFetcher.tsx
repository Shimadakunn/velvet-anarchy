"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDataStore } from "@/store/dataStore";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Component to fetch data for a single product
function ProductDataFetcher({ productId }: { productId: Id<"products"> }) {
  const { setVariants, setReviews } = useDataStore();

  // Fetch variants for this product
  const variants = useQuery(api.variants.get, { id: productId });

  // Fetch reviews for this product
  const reviews = useQuery(api.reviews.get, { productId });

  // Update cache when variants arrive
  useEffect(() => {
    if (variants !== undefined) {
      setVariants(productId, variants);
    }
  }, [variants, productId, setVariants]);

  // Update cache when reviews arrive
  useEffect(() => {
    if (reviews !== undefined) {
      setReviews(productId, reviews);
    }
  }, [reviews, productId, setReviews]);

  return null;
}

// Main data fetcher component
export function DataFetcher() {
  const {
    setProducts,
    setHeroSlides,
    setProductBySlug,
  } = useDataStore();

  // Fetch all products
  const products = useQuery(api.products.listActive);

  // Fetch hero slides
  const heroSlides = useQuery(api.hero.getActiveSlides);

  // Update cache when products arrive
  useEffect(() => {
    if (products !== undefined) {
      setProducts(products);

      // Cache each product by slug
      products.forEach(product => {
        if (product.slug) {
          setProductBySlug(product.slug, product);
        }
      });
    }
  }, [products, setProducts, setProductBySlug]);

  // Update cache when hero slides arrive
  useEffect(() => {
    if (heroSlides !== undefined) {
      setHeroSlides(heroSlides);
    }
  }, [heroSlides, setHeroSlides]);

  // Get all product IDs
  const allProductIds = products?.map(p => p._id as Id<"products">) || [];

  return (
    <>
      {/* Fetch variants and reviews for each product */}
      {allProductIds.map((productId) => (
        <ProductDataFetcher key={productId} productId={productId} />
      ))}
    </>
  );
}
