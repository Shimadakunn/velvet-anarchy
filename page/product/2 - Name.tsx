import { Product } from "@/lib/type";
import Image from "next/image";

export default function Name({ product }: { product: Product }) {
  return (
    <h1 className="text-3xl font-bold font-Dirty relative inline-block">
      {product.name}
    </h1>
  );
}
