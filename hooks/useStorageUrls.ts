"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useStorageUrls(storageIds: string[]) {
  const urls = useQuery(
    api.files.getUrls,
    storageIds.length > 0
      ? { storageIds: storageIds as Id<"_storage">[] }
      : "skip"
  );

  return urls || null;
}
