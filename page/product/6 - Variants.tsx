import { useMemo } from "react";
import { Variant, VariantType } from "@/lib/type";

interface VariantsProps {
  variants: Variant[];
  selectedVariants: Record<VariantType, string>;
  onVariantChange: (type: VariantType, value: string) => void;
}

export default function Variants({
  variants,
  selectedVariants,
  onVariantChange,
}: VariantsProps) {
  // Group variants by type
  const variantsByType = useMemo(() => {
    const grouped: Partial<Record<VariantType, string[]>> = {};

    variants.forEach((variant) => {
      if (!grouped[variant.type]) {
        grouped[variant.type] = [];
      }
      if (!grouped[variant.type]!.includes(variant.value)) {
        grouped[variant.type]!.push(variant.value);
      }
    });

    return grouped;
  }, [variants]);

  // Get available variant types
  const availableTypes = Object.keys(variantsByType) as VariantType[];

  if (availableTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {availableTypes.map((type) => {
        const options = variantsByType[type] || [];
        const selectedValue = selectedVariants[type];

        return (
          <div key={type}>
            <h3 className="text-sm font-medium mb-2 capitalize">
              {type.toUpperCase()}
            </h3>
            <div className="flex flex-wrap gap-2">
              {options.map((value) => {
                const isSelected = selectedValue === value;
                // Find the variant to get the subvalue (hex color)
                const variant = variants.find(
                  (v) => v.type === type && v.value === value
                );

                // Check if it's a color variant with a hex value
                const isColorWithHex = type === "color" && variant?.subvalue;

                return (
                  <button
                    key={value}
                    onClick={() => onVariantChange(type, value)}
                    className={`
                      transition-all duration-200 cursor-pointer
                      ${
                        isColorWithHex
                          ? `w-10 h-10 rounded-full border-2 ${
                              isSelected
                                ? "ring-2 ring-foreground"
                                : "border-gray-300 hover:border-gray-400"
                            }`
                          : ` px-4 py-2 bg-[#F5F5F5] ${
                              isSelected ? " ring-1 ring-foreground" : ""
                            }`
                      }
                    `}
                    style={
                      isColorWithHex
                        ? { backgroundColor: variant.subvalue }
                        : undefined
                    }
                    title={isColorWithHex ? value : undefined}
                  >
                    {!isColorWithHex && value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
