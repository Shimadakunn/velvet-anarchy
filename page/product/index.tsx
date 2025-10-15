import Rating from "./1 - Rating";
import Name from "./2 - Name";
import Badges from "./3 - Badges";
import Size from "./4 - Size";
import Offers from "./5 - Offers";
import Buy from "./6 - Buy";
import Accordion from "./7 - Accordion";
import { Product as ProductType, Variant } from "@/lib/type";

export default function Product({
  product,
  variants,
}: {
  product: ProductType;
  variants: Variant[];
}) {
  return (
    <div className="min-h-screen">
      <Rating product={product} />
      <div className="mb-4" />
      <Name product={product} />
      <Badges product={product} />
      <div className="mb-8" />
      <Size product={product} />
      <div className="mb-8" />
      <Offers product={product} variants={variants} />
      <div className="mb-4" />
      <Buy />
      <div className="mb-8" />
      <Accordion product={product} />
    </div>
  );
}
