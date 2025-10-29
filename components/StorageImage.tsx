"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import Loading from "./Loading";

type StorageImageProps = {
  storageId: string;
  alt: string;
  className?: string;
};

export default function StorageImage({
  storageId,
  alt,
  className = "",
}: StorageImageProps) {
  const imageUrl = useQuery(api.files.getUrl, {
    storageId: storageId as Id<"_storage">,
  });

  if (!imageUrl) {
    return <Loading />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      width={1000}
      height={1000}
    />
  );
}
