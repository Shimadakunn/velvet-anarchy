"use client";
import { useIsMobile } from "@/lib/isMobile";
import { Star } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Rating({ product }: { product: any }) {
  const isMobile = useIsMobile();
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const starSize = isMobile ? 4 : 5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`w-${starSize} h-${starSize} fill-black text-black`}
          />
        ))}
        {hasHalfStar && (
          <div className={`relative w-${starSize} h-${starSize}`}>
            <Star
              className={`w-${starSize} h-${starSize} text-black absolute`}
            />
            <div className="overflow-hidden absolute w-1/2">
              <Star
                className={`w-${starSize} h-${starSize} fill-black text-black`}
              />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`w-${starSize} h-${starSize} text-black`}
          />
        ))}
      </div>
      <span className="text-sm md:text-md font-semibold text-gray-600">
        {product.rating}/5 ({product.reviews.toLocaleString()} Reviews)
      </span>
    </div>
  );
}
