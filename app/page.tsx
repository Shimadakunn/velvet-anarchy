"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export default function Home() {
  const products = useQuery(api.products.list);
  console.log(products);

  // Cast the string to Id<"products"> type
  const productId = products?.[0]._id! as Id<"products">;
  const variants = useQuery(api.variants.get, {
    id: productId,
  });
  console.log(variants);
  return <div></div>;
}
