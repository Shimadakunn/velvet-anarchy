import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import { product } from "@/const";

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start space-y-6 md:space-x-6 px-4 md:px-0 py-16">
      <div className="w-full md:w-5/10">
        <Carroussel images={product.images} />
      </div>
      <div className="w-full md:w-5/10">
        <Product product={product} />
      </div>
    </div>
  );
}
