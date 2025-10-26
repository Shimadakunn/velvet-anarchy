import { Product } from "@/lib/type";

export default function Guide({ product }: { product: Product }) {
  return (
    <button className="font-light underline text-xs mb-2 cursor-pointer">
      Size Guide
    </button>
  );
}
