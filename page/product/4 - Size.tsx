import { Product } from "@/lib/type";

export default function Size({ product }: { product: Product }) {
  return (
    <h1 className="font-light text-gray-600">
      Size: <span className="text-foreground font-medium">ONE SIZE</span>
    </h1>
  );
}
