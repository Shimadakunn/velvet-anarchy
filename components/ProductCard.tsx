"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useIsMobile } from "@/lib/isMobile";
import { Product } from "@/lib/type";
import { useQuery } from "convex/react";
import { CheckCheck, Flame, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { trackProductClicked } from "@/lib/analytics";
import { usePathname } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const pathname = usePathname();
  
  // Get the first image URL only if images exist
  const imageUrl = useQuery(
    api.files.getUrl,
    product.images.length > 0
      ? { storageId: product.images[0] as Id<"_storage"> }
      : "skip"
  );

  const handleClick = () => {
    // Determine the source based on current page
    let source = "unknown";
    if (pathname === "/") {
      source = "homepage";
    } else if (pathname === "/products") {
      source = "products_page";
    }
    
    trackProductClicked(product, source);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleClick}
      className="group block bg-white transition-all duration-300 relative w-full mx-12 md:mx-0 md:w-64"
    >
      {/* Product Image Container */}
      <div className="relative h-[20rem] overflow-hidden mb-4">
        {product.images.length === 0 ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-sm">No Image</span>
          </div>
        ) : imageUrl ? (
          <div className="w-full h-full p-8 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse"></div>
        )}
      </div>

      {/* Product Info */}
      <div className="pb-4">
        <Rating product={product} />
        {/* Product Name */}
        <h3 className="text-xl font-Meg mt-1">{product.name}</h3>

        {/* Price */}
        <p className="text-base font-black -translate-y-2">
          {product.price.toFixed(2)} €
        </p>
        <Badges product={product} />
      </div>

      {/* Most Popular Badge */}
      {product.mostPopular && (
        <div className="absolute -top-6 -right-2 w-16 h-16 md:w-20 md:h-20 rotate-12">
          <Image
            src="/popular.svg"
            alt="Most Popular"
            width={80}
            height={80}
            className="w-full h-full"
          />
        </div>
      )}
    </Link>
  );
}

function Badges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      {product.trending && (
        <div className="px-2 py-1 bg-pink-100 text-pink-500  rounded-full inline-block">
          <Flame className="w-4 h-4 inline-block mb-[3px] mr-[1px]" />
          Trending!
        </div>
      )}
      <div className="px-2 py-1 bg-green-100 text-green-600 rounded-full inline-block">
        <CheckCheck className="w-4 h-4 inline-block mb-[2px] mr-[2px]" />
        {product.sold} sold
      </div>
      <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full inline-block">
        <Package className="w-4 h-4 inline-block mb-[3px] mr-[2px]" />
        {product.stock} left
      </div>
    </div>
  );
}

function Rating({ product }: { product: Product }) {
  const isMobile = useIsMobile();
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const starSize = isMobile ? 4 : 5;
  console.log(isMobile);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`w-4 h-${starSize} fill-black text-black`}
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
      <span className="font-black text-xs pt-1">{product.rating}/5</span>
    </div>
  );
}
