"use client";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Product, Variant, VariantType } from "@/lib/type";

export default function Buy({
  product,
  variants,
  selectedVariants,
  selectedOffer,
  buy2Selections,
}: {
  product: Product;
  variants: Variant[];
  selectedVariants: Record<VariantType, string>;
  selectedOffer: "buy1" | "buy2";
  buy2Selections: {
    item1: Record<VariantType, string>;
    item2: Record<VariantType, string>;
  };
}) {
  const addItem = useCartStore((state) => state.addItem);

  // Get available variant types for this product
  const availableVariantTypes = useMemo(() => {
    const types = new Set<VariantType>();
    variants.forEach((variant) => {
      types.add(variant.type);
    });
    return Array.from(types);
  }, [variants]);

  const handleAddToCart = () => {
    if (!product._id || !product.slug) {
      toast.error("Invalid product data");
      return;
    }

    if (selectedOffer === "buy1") {
      // Validate that all available variants have been selected for buy1
      const hasEmptyVariant = availableVariantTypes.some(
        (type) => !selectedVariants[type]
      );

      if (hasEmptyVariant) {
        toast.error("Please select all options");
        return;
      }

      addItem({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0] || "",
        price: product.price,
        variants: selectedVariants,
      });

      toast.success("Added to cart!");
    } else {
      // Buy 2 option - add both items
      const hasEmptyVariantItem1 = availableVariantTypes.some(
        (type) => !buy2Selections.item1[type]
      );
      const hasEmptyVariantItem2 = availableVariantTypes.some(
        (type) => !buy2Selections.item2[type]
      );

      if (hasEmptyVariantItem1 || hasEmptyVariantItem2) {
        toast.error("Please select all options for both items");
        return;
      }

      // Add first item with 10% discount
      addItem({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0] || "",
        price: product.price * 0.9,
        variants: buy2Selections.item1,
      });

      // Add second item with 10% discount
      addItem({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0] || "",
        price: product.price * 0.9,
        variants: buy2Selections.item2,
      });

      toast.success("Added 2 items to cart!");
    }
  };

  return (
    <Button
      effect="ringHover"
      className="w-full relative bg-foreground text-background py-4 rounded-lg hover:scale-[1.005] active:scale-[0.98] transition-all duration-200"
      onClick={handleAddToCart}
    >
      <div className="flex flex-col space-y-[-6px]">
        <h1 className="text-3xl font-black font-Dirty">Add to CaRt</h1>
        <p className="text-background/80">30-Day Guarantee</p>
      </div>

      <ChevronRight
        style={{ width: "28px", height: "28px" }}
        className="absolute right-4 top-1/2 -translate-y-1/2 "
      />
    </Button>
  );
}
