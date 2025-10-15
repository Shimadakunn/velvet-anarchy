"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Product, Variant, VariantType, variantTypes } from "@/lib/type";

type ItemKey = "buy1" | "item1" | "item2";

export default function Offers({
  product,
  variants,
}: {
  product: Product;
  variants: Variant[];
}) {
  // Group variants by type dynamically
  const variantsByType = useMemo(() => {
    const grouped: Record<VariantType, string[]> = {} as Record<
      VariantType,
      string[]
    >;

    variantTypes.forEach((type) => {
      grouped[type] = variants
        .filter((v) => v.type === type)
        .map((v) => v.value);
    });

    return grouped;
  }, [variants]);

  // Create initial selections dynamically
  const getInitialSelection = (): Record<VariantType, string> => {
    const selection: Record<VariantType, string> = {} as Record<
      VariantType,
      string
    >;

    variantTypes.forEach((type) => {
      selection[type] = variantsByType[type]?.[0] || "";
    });

    return selection;
  };

  const [selectedOffer, setSelectedOffer] = useState<"buy1" | "buy2">("buy2");
  const [selections, setSelections] = useState<
    Record<ItemKey, Record<VariantType, string>>
  >({
    buy1: getInitialSelection(),
    item1: getInitialSelection(),
    item2: getInitialSelection(),
  });

  const handleSelectionChange = (
    item: ItemKey,
    type: VariantType,
    value: string
  ) => {
    setSelections((prev) => ({
      ...prev,
      [item]: { ...prev[item], [type]: value },
    }));
  };

  // Render variant selectors for an item
  const renderVariantSelectors = (itemKey: ItemKey, showLabel = true) => {
    return (
      <div className={showLabel ? "space-y-3 pt-3 border-t border-gray-200" : "flex items-center gap-2 flex-1"}>
        {showLabel && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">
              {variantTypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-1">
          {variantTypes.map((type) => {
            const options = variantsByType[type] || [];
            if (options.length === 0) return null;

            return (
              <div key={type} className="relative flex-1">
                <select
                  value={selections[itemKey][type] || ""}
                  onChange={(e) =>
                    handleSelectionChange(itemKey, type, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {options.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render multiple item selectors for Buy 2 option
  const renderMultipleItems = () => {
    return (
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">
            {variantTypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")}
          </span>
        </div>

        {/* Item 1 */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">#1</span>
          {renderVariantSelectors("item1", false)}
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">#2</span>
          {renderVariantSelectors("item2", false)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-2">
      {/* Buy 1 Option */}
      <div
        onClick={() => setSelectedOffer("buy1")}
        className={`relative p-4 border rounded-2xl cursor-pointer transition-all ${
          selectedOffer === "buy1"
            ? "border-black bg-gray-50 border-2"
            : "border-gray-500 bg-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOffer === "buy1" ? "border-black" : "border-gray-500"
                }`}
              >
                <div
                  className={`rounded-full ${
                    selectedOffer === "buy1"
                      ? "bg-black w-3 h-3"
                      : "bg-white w-4 h-4"
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Buy 1</h3>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  LIMITED STOCK
                </span>
              </div>
              <p className="text-sm text-gray-600">Save €0.00</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">€{product.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Variant Selectors for Buy 1 */}
        {selectedOffer === "buy1" && renderVariantSelectors("buy1")}
      </div>

      {/* Buy 2 Get 10% OFF Option */}
      <div
        onClick={() => setSelectedOffer("buy2")}
        className={`relative p-4 border rounded-2xl cursor-pointer transition-all ${
          selectedOffer === "buy2"
            ? "border-black bg-gray-50 border-2"
            : "border-gray-500 bg-gray-200"
        }`}
      >
        {/* Most Popular Badge */}
        <Image
          src="/popular.svg"
          alt="Most Popular"
          width={90}
          height={90}
          className="absolute -top-8 -right-4"
        />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOffer === "buy2" ? "border-black" : "border-gray-500"
                }`}
              >
                <div
                  className={`rounded-full ${
                    selectedOffer === "buy2"
                      ? "bg-black w-3 h-3"
                      : "bg-white w-4 h-4"
                  }`}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">Buy 2 get 10% OFF</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-green-600">
                  SAVE €{(product.price * 2 * 0.1).toFixed(2)}
                </p>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  LIMITED STOCK
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              €{(product.price * 2 * 0.9).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 line-through">
              €{(product.price * 2).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Variant Selectors for Buy 2 */}
        {selectedOffer === "buy2" && renderMultipleItems()}
      </div>
    </div>
  );
}
