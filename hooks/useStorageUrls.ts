"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDataStore } from "@/store/dataStore";
import { useEffect, useMemo } from "react";

export function useStorageUrls(storageIds: string[]) {
  const { getImageUrl, setImageUrls } = useDataStore();

  // Check which URLs we already have cached
  const cachedUrls = useMemo(() => {
    return storageIds.map((id) => getImageUrl(id));
  }, [storageIds, getImageUrl]);

  // Check if all URLs are cached
  const allCached = cachedUrls.every((url) => url !== null);

  // Only fetch URLs that aren't cached
  const urls = useQuery(
    api.files.getUrls,
    !allCached && storageIds.length > 0
      ? { storageIds: storageIds as Id<"_storage">[] }
      : "skip"
  );

  // Update cache when fresh URLs arrive
  useEffect(() => {
    if (urls && urls.length === storageIds.length) {
      const urlMap: Record<string, string> = {};
      storageIds.forEach((id, index) => {
        urlMap[id] = urls[index];
      });
      setImageUrls(urlMap);
    }
  }, [urls, storageIds, setImageUrls]);

  // Return cached URLs if all are available, otherwise return fresh URLs
  if (allCached) {
    return cachedUrls as string[];
  }

  return urls || null;
}
