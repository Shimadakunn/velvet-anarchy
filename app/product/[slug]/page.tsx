"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import { Product as ProductType, Variant } from "@/lib/type";
import TrustBadges from "@/components/TrustBadges";

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

  // Get image URLs from storage
  const imageUrls = useStorageUrls(product?.images || []);

  // Show loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
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

  if (!variants) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading variants...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-start space-y-6 md:space-x-6 py-8">
        <div className="w-full md:w-5/10">
          {imageUrls && imageUrls.length > 0 ? (
            <Carroussel images={imageUrls} />
          ) : (
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Loading images...</p>
            </div>
          )}
        </div>
        <div className="w-full md:w-5/10 px-4 md:px-0">
          <Product product={product} variants={variants} />
        </div>
      </div>
      <TrustBadges />
    </>
  );
}
