import { Product } from "@/lib/type";

export default function Name({ product }: { product: Product }) {
  return (
    <h1 className="text-3xl font-bold font-Meg relative inline-block">
      {product.name}
    </h1>
  );
}
