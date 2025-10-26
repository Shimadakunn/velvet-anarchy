"use client";

import { useState, useMemo } from "react";
import Rating from "./1 - Rating";
import Name from "./2 - Name";
import Badges from "./3 - Badges";
import Price from "./4 - Price";
import Guide from "./4.5 - Guide";
import Quantity from "./5 - Quantity";
import Variants from "./6 - Variants";
import Buy from "./7 - Buy";
import Accordion from "./8 - Accordion";
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

  const [quantity, setQuantity] = useState<number>(1);

  const handleVariantChange = (type: VariantType, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="">
      <Rating product={product} />
      <div className="mb-4" />

      <Name product={product} />
      <Badges product={product} />

      <div className="mb-4" />
      <Price price={product.price} />
      <div className="mb-2" />

      <Guide product={product} />

      <Variants
        variants={variants}
        selectedVariants={selectedVariants}
        onVariantChange={handleVariantChange}
      />
      <div className="mb-4" />
      <Quantity quantity={quantity} onQuantityChange={setQuantity} />
      <div className="mb-8" />
      <Buy
        product={product}
        variants={variants}
        selectedVariants={selectedVariants}
        quantity={quantity}
      />
      <div className="mb-8" />
      <Accordion product={product} />
    </div>
  );
}
