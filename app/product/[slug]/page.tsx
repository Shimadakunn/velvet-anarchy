"use client";

import Carroussel from "@/components/Carroussel";
import Loading from "@/components/Loading";
import Reviews from "@/components/Reviews";
import TrustBadges from "@/components/TrustBadges";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import { VariantType, variantTypes } from "@/lib/type";
import Product from "@/page/product";
import { useDataStore } from "@/store/dataStore";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  // Group variants by type
  const variantsByType = useMemo(() => {
    const grouped: Record<VariantType, string[]> = {} as Record<
      VariantType,
      string[]
    >;

    if (!variants || variants.length === 0) {
      variantTypes.forEach((type) => {
        grouped[type] = [];
      });
      return grouped;
    }

    variantTypes.forEach((type) => {
      grouped[type] = variants
        .filter((v) => v.type === type)
        .map((v) => v.value);
    });

    return grouped;
  }, [variants]);

  // Initialize selected variants with first available option for each type
  const getInitialVariants = (): Record<VariantType, string> => {
    const initial: Record<VariantType, string> = {} as Record<
      VariantType,
      string
    >;

    variantTypes.forEach((type) => {
      initial[type] = variantsByType[type]?.[0] || "";
    });

    return initial;
  };

  const [selectedVariants, setSelectedVariants] =
    useState<Record<VariantType, string>>(getInitialVariants());

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
          <Carroussel
            images={imageUrls}
            variants={variants}
            selectedColorVariant={selectedVariants.color}
          />
        </div>
        <div className="w-full md:w-5/10 px-4 md:px-0">
          <Product
            product={product}
            variants={variants}
            onVariantChange={setSelectedVariants}
          />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 md:px-0">
        <Reviews reviews={reviews} productId={productId!} />
      </div>
      <TrustBadges />
    </>
  );
}
