"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        Loading...
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} />;
}
