"use client";

import { useState, useMemo } from "react";
import Rating from "./1 - Rating";
import Name from "./2 - Name";
import Badges from "./3 - Badges";
import Size from "./4 - Size";
import Offers from "./5 - Offers";
import Buy from "./6 - Buy";
import Accordion from "./7 - Accordion";
import {
  Product as ProductType,
  Variant,
  VariantType,
  variantTypes,
} from "@/lib/type";

export default function Product({
  product,
  variants = [],
}: {
  product: ProductType;
  variants?: Variant[];
}) {
  // Group variants by type
  const variantsByType = useMemo(() => {
    const grouped: Record<VariantType, string[]> = {} as Record<
      VariantType,
      string[]
    >;

    if (!variants || variants.length === 0) {
      // Initialize with empty arrays for each type
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

  const [selectedOffer, setSelectedOffer] = useState<"buy1" | "buy2">("buy1");

  const [buy2Selections, setBuy2Selections] = useState<{
    item1: Record<VariantType, string>;
    item2: Record<VariantType, string>;
  }>({
    item1: getInitialVariants(),
    item2: getInitialVariants(),
  });

  return (
    <div className="">
      <Rating product={product} />
      <div className="mb-4" />
      <Name product={product} />
      <Badges product={product} />
      <div className="mb-8" />
      <Size product={product} />
      <div className="mb-8" />
      <Offers
        product={product}
        variants={variants}
        selectedVariants={selectedVariants}
        onVariantChange={setSelectedVariants}
        selectedOffer={selectedOffer}
        onOfferChange={setSelectedOffer}
        buy2Selections={buy2Selections}
        onBuy2SelectionsChange={setBuy2Selections}
      />
      <div className="mb-4" />
      <Buy
        product={product}
        selectedVariants={selectedVariants}
        selectedOffer={selectedOffer}
        buy2Selections={buy2Selections}
      />
      <div className="mb-8" />
      <Accordion product={product} />
    </div>
  );
}
