/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Name({ product }: { product: any }) {
  return <h1 className="text-3xl font-bold font-Dirty">{product.name}</h1>;
}
