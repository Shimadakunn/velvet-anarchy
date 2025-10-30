import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Variant, Review } from "@/lib/type";
import { Id } from "@/convex/_generated/dataModel";

// Hero slide type based on the API response
export type HeroSlide = {
  _id: Id<"hero">;
  image: string;
  title: string;
  productId?: Id<"products">;
  order: number;
  isActive: boolean;
  imageUrl: string;
  product: { slug: string; name: string } | null;
  _creationTime: number;
};

type DataStore = {
  // Products
  products: Product[];
  productsLastFetched: number | null;

  // Hero slides
  heroSlides: HeroSlide[];
  heroSlidesLastFetched: number | null;

  // Products by slug (for product detail pages)
  productsBySlug: Record<string, Product>;
  productsBySlugLastFetched: Record<string, number>;

  // Variants by product ID
  variantsByProductId: Record<string, Variant[]>;
  variantsLastFetched: Record<string, number>;

  // Reviews by product ID
  reviewsByProductId: Record<string, Review[]>;
  reviewsLastFetched: Record<string, number>;

  // Image URLs by storage ID
  imageUrls: Record<string, string>;

  // Actions
  setProducts: (products: Product[]) => void;
  setHeroSlides: (slides: HeroSlide[]) => void;
  setProductBySlug: (slug: string, product: Product) => void;
  setVariants: (productId: string, variants: Variant[]) => void;
  setReviews: (productId: string, reviews: Review[]) => void;
  setImageUrl: (storageId: string, url: string) => void;
  setImageUrls: (urls: Record<string, string>) => void;

  // Getters with cache check
  getProducts: () => { data: Product[] | null; shouldRefresh: boolean };
  getHeroSlides: () => { data: HeroSlide[] | null; shouldRefresh: boolean };
  getProductBySlug: (slug: string) => { data: Product | null; shouldRefresh: boolean };
  getVariants: (productId: string) => { data: Variant[] | null; shouldRefresh: boolean };
  getReviews: (productId: string) => { data: Review[] | null; shouldRefresh: boolean };
  getImageUrl: (storageId: string) => string | null;

  // Clear cache
  clearCache: () => void;
};

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

const shouldRefreshData = (lastFetched: number | null): boolean => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      products: [],
      productsLastFetched: null,

      heroSlides: [],
      heroSlidesLastFetched: null,

      productsBySlug: {},
      productsBySlugLastFetched: {},

      variantsByProductId: {},
      variantsLastFetched: {},

      reviewsByProductId: {},
      reviewsLastFetched: {},

      imageUrls: {},

      setProducts: (products) => {
        set({
          products,
          productsLastFetched: Date.now(),
        });
      },

      setHeroSlides: (slides) => {
        set({
          heroSlides: slides,
          heroSlidesLastFetched: Date.now(),
        });
      },

      setProductBySlug: (slug, product) => {
        set({
          productsBySlug: {
            ...get().productsBySlug,
            [slug]: product,
          },
          productsBySlugLastFetched: {
            ...get().productsBySlugLastFetched,
            [slug]: Date.now(),
          },
        });
      },

      setVariants: (productId, variants) => {
        set({
          variantsByProductId: {
            ...get().variantsByProductId,
            [productId]: variants,
          },
          variantsLastFetched: {
            ...get().variantsLastFetched,
            [productId]: Date.now(),
          },
        });
      },

      setReviews: (productId, reviews) => {
        set({
          reviewsByProductId: {
            ...get().reviewsByProductId,
            [productId]: reviews,
          },
          reviewsLastFetched: {
            ...get().reviewsLastFetched,
            [productId]: Date.now(),
          },
        });
      },

      setImageUrl: (storageId, url) => {
        set({
          imageUrls: {
            ...get().imageUrls,
            [storageId]: url,
          },
        });
      },

      setImageUrls: (urls) => {
        set({
          imageUrls: {
            ...get().imageUrls,
            ...urls,
          },
        });
      },

      getProducts: () => {
        const state = get();
        return {
          data: state.products.length > 0 ? state.products : null,
          shouldRefresh: shouldRefreshData(state.productsLastFetched),
        };
      },

      getHeroSlides: () => {
        const state = get();
        return {
          data: state.heroSlides.length > 0 ? state.heroSlides : null,
          shouldRefresh: shouldRefreshData(state.heroSlidesLastFetched),
        };
      },

      getProductBySlug: (slug) => {
        const state = get();
        const product = state.productsBySlug[slug];
        const lastFetched = state.productsBySlugLastFetched[slug];
        return {
          data: product || null,
          shouldRefresh: shouldRefreshData(lastFetched),
        };
      },

      getVariants: (productId) => {
        const state = get();
        const variants = state.variantsByProductId[productId];
        const lastFetched = state.variantsLastFetched[productId];
        return {
          data: variants || null,
          shouldRefresh: shouldRefreshData(lastFetched),
        };
      },

      getReviews: (productId) => {
        const state = get();
        const reviews = state.reviewsByProductId[productId];
        const lastFetched = state.reviewsLastFetched[productId];
        return {
          data: reviews || null,
          shouldRefresh: shouldRefreshData(lastFetched),
        };
      },

      getImageUrl: (storageId) => {
        return get().imageUrls[storageId] || null;
      },

      clearCache: () => {
        set({
          products: [],
          productsLastFetched: null,
          heroSlides: [],
          heroSlidesLastFetched: null,
          productsBySlug: {},
          productsBySlugLastFetched: {},
          variantsByProductId: {},
          variantsLastFetched: {},
          reviewsByProductId: {},
          reviewsLastFetched: {},
          imageUrls: {},
        });
      },
    }),
    {
      name: "data-cache-storage", // localStorage key
    }
  )
);
