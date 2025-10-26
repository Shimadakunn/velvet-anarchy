"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import { Product as ProductType, Variant, Review } from "@/lib/type";
import TrustBadges from "@/components/TrustBadges";
import Reviews from "@/components/Reviews";
import Loading from "@/components/Loading";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch product by slug
  const product: ProductType | undefined | null = useQuery(
    api.products.getBySlug,
    {
      slug,
    }
  );

  // Fetch variants if product exists
  const variants: Variant[] | undefined = useQuery(
    api.variants.get,
    product ? { id: product._id as Id<"products"> } : "skip"
  );

  // Fetch reviews if product exists
  const reviews: Review[] | undefined = useQuery(
    api.reviews.get,
    product ? { productId: product._id as Id<"products"> } : "skip"
  );

  // Get image URLs from storage
  const imageUrls = useStorageUrls(product?.images || []);

  // Wait for all queries to complete
  if (
    product === undefined ||
    variants === undefined ||
    reviews === undefined
  ) {
    return <Loading />;
  }

  // Show not found state
  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-500">
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  // Wait for image URLs to load
  if (!imageUrls || imageUrls.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-start space-y-6 md:space-x-6 md:pt-8">
        <div className="w-full md:w-5/10">
          <Carroussel images={imageUrls} />
        </div>
        <div className="w-full md:w-5/10 px-4 md:px-0">
          <Product product={product} variants={variants} />
        </div>
      </div>
      {reviews.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 md:px-0">
          <Reviews reviews={reviews} />
        </div>
      )}
      <TrustBadges />
    </>
  );
}
