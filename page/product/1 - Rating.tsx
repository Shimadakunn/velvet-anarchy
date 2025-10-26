"use client";
import { useIsMobile } from "@/lib/isMobile";
import { Star } from "lucide-react";
import { Product } from "@/lib/type";
import Image from "next/image";

export default function Rating({ product }: { product: Product }) {
  const isMobile = useIsMobile();
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const starSize = isMobile ? 4 : 5;

  return (
    <div className="inline-flex items-center gap-1 relative">
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
      <span className="font-black">{product.rating}/5</span>
      {product.mostPopular && (
        <div className="absolute -top-5 -right-18 w-16 h-16 rotate-12 z-20">
          <Image
            src="/popular.svg"
            alt="Most Popular"
            width={80}
            height={80}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
