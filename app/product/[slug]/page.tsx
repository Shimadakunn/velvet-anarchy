"use client";

import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import TrustBadges from "@/components/TrustBadges";
import Reviews from "@/components/Reviews";
import Loading from "@/components/Loading";
import { useDataStore } from "@/store/dataStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { getProductBySlug, getVariants, getReviews } = useDataStore();

  // Get data from cache only - fetching happens globally in Footer
  const { data: product } = getProductBySlug(slug);
  const productId = product?._id as Id<"products"> | undefined;

  const { data: variants } = productId
    ? getVariants(productId)
    : { data: null };
  const { data: reviews } = productId ? getReviews(productId) : { data: null };

  // Get image URLs from storage
  const imageUrls = useStorageUrls(product?.images || []);

  // Only show loading on first visit when cache is empty
  if (!product || !variants || !reviews) {
    return <Loading />;
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
      <div className="mx-auto max-w-5xl px-4 md:px-0">
        <Reviews reviews={reviews} productId={productId!} />
      </div>
      <TrustBadges />
    </>
  );
}
