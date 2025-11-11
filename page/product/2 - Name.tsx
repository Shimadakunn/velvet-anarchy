import { Product } from "@/lib/type";

export default function Name({ product }: { product: Product }) {
  return (
    <h1 className="text-2xl font-normal tracking-tight uppercase relative inline-block">
      {product.name}
    </h1>
  );
}
