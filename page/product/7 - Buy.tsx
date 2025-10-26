"use client";
import { useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Product, Variant, VariantType } from "@/lib/type";

export default function Buy({
  product,
  variants,
  selectedVariants,
  quantity = 1,
}: {
  product: Product;
  variants: Variant[];
  selectedVariants: Record<VariantType, string>;
  quantity?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

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

    // Validate that all available variants have been selected
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
      quantity: quantity,
    });

    toast.success(
      `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart!`
    );
  };

  const handleBuyNow = () => {
    if (!product._id || !product.slug) {
      toast.error("Invalid product data");
      return;
    }

    // Validate that all available variants have been selected
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
      quantity: quantity,
      openCart: false,
    });

    toast.success(
      `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart!`
    );

    // Redirect to checkout
    router.push("/checkout");
  };

  return (
    <div className="flex space-x-4">
      <Button
        effect="ringHover"
        className="w-full relative rounded-none bg-[#ebebeb] text-background py-4 hover:scale-[1.005] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        onClick={handleAddToCart}
      >
        <h1 className="text-lg md:text-xl font-black tracking-tighter text-foreground">
          ADD TO CART
        </h1>
      </Button>
      <Button
        effect="ringHover"
        className="w-full relative rounded-none bg-foreground text-background py-4 hover:scale-[1.005] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        onClick={handleBuyNow}
      >
        <h1 className="text-lg md:text-xl font-black tracking-tighter">
          BUY NOW
        </h1>
      </Button>
    </div>
  );
}
