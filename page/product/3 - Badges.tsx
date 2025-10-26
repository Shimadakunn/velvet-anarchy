import { CheckCheck, Flame, Package } from "lucide-react";
import { Product } from "@/lib/type";

export default function Badges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {product.trending && (
        <div className="px-2 py-1 bg-pink-100 text-pink-500 text-xs font-semibold rounded-full inline-block">
          <Flame className="w-4 h-4 inline-block mb-[3px] mr-[2px]" />
          Trending!
        </div>
      )}
      <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full inline-block">
        <CheckCheck className="w-4 h-4 inline-block mb-[2px] mr-[2px]" />
        {product.sold} sold
      </div>
      <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full inline-block">
        <Package className="w-4 h-4 inline-block mb-[3px] mr-[3px]" />
        {product.stock} left
      </div>
    </div>
  );
}
