"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const products = useQuery(api.products.get);
  return <div></div>;
}
