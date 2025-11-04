"use client";

import Carroussel from "@/components/Carroussel";
import Reviews from "@/components/Reviews";
import StorageImage from "@/components/StorageImage";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import { getRandomDateLastMonth, getRandomNumber } from "@/lib/getRandom";
import {
  Product as ProductType,
  Review,
  Variant,
  VariantType,
  variantTypes,
} from "@/lib/type";
import Product from "@/page/product";
import { useMutation, useQuery } from "convex/react";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModifyProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Fetch product by slug
  const existingProduct: ProductType | undefined | null = useQuery(
    api.products.getBySlug,
    { slug }
  );

  // Fetch variants if product exists
  const existingVariants: Variant[] | undefined = useQuery(
    api.variants.get,
    existingProduct ? { id: existingProduct._id as Id<"products"> } : "skip"
  );

  // Fetch reviews if product exists
  const existingReviews: Review[] | undefined = useQuery(
    api.reviews.get,
    existingProduct
      ? { productId: existingProduct._id as Id<"products"> }
      : "skip"
  );

  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createReview = useMutation(api.reviews.create);
  const deleteReview = useMutation(api.reviews.deleteReview);

  const [product, setProduct] = useState<ProductType>({
    name: "",
    slug: "",
    detail: "",
    images: [],
    price: 0,
    rating: 0,
    review: 0,
    sold: 0,
    stock: 0,
    trending: false,
    mostPopular: false,
    order: 0,
    sizeGuide: undefined,
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariantType, setNewVariantType] = useState<VariantType>("color");
  const [newVariantValue, setNewVariantValue] = useState("");
  const [newVariantSubvalue, setNewVariantSubvalue] = useState("");
  const [newVariantImage, setNewVariantImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewUserName, setNewReviewUserName] = useState("");
  const [newReviewUserImage, setNewReviewUserImage] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState(
    getRandomNumber(4, 5, true)
  );
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewDate, setNewReviewDate] = useState(getRandomDateLastMonth());
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);

  // Initialize form with existing product data
  useEffect(() => {
    if (
      existingProduct &&
      existingVariants &&
      existingReviews &&
      !isInitialized
    ) {
      setProduct({
        name: existingProduct.name,
        slug: existingProduct.slug,
        detail: existingProduct.detail,
        images: existingProduct.images,
        price: existingProduct.price,
        rating: existingProduct.rating,
        review: existingProduct.review ?? 0,
        sold: existingProduct.sold,
        stock: existingProduct.stock,
        trending: existingProduct.trending ?? false,
        mostPopular: existingProduct.mostPopular ?? false,
        order: existingProduct.order ?? 0,
        sizeGuide: existingProduct.sizeGuide,
      });
      setVariants(existingVariants);
      setReviews(existingReviews);
      setIsInitialized(true);
    }
  }, [existingProduct, existingVariants, existingReviews, isInitialized]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Generate upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Upload the file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await result.json();
        return storageId;
      });

      const storageIds = await Promise.all(uploadPromises);

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...storageIds],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle user image upload for review
  const handleReviewUserImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { storageId } = await result.json();
      setNewReviewUserImage(storageId);
    } catch (error) {
      console.error("Error uploading user image:", error);
      alert("Failed to upload user image. Please try again.");
    }
  };

  // Handle review images upload (customer's product photos)
  const handleReviewImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await result.json();
        return storageId;
      });

      const storageIds = await Promise.all(uploadPromises);
      setNewReviewImages([...newReviewImages, ...storageIds]);
    } catch (error) {
      console.error("Error uploading review images:", error);
      alert("Failed to upload review images. Please try again.");
    }
  };

  // Remove review image
  const removeReviewImage = (index: number) => {
    setNewReviewImages(newReviewImages.filter((_, i) => i !== index));
  };

  // Handle size guide upload
  const handleSizeGuideUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { storageId } = await result.json();
      setProduct((prev) => ({
        ...prev,
        sizeGuide: storageId,
      }));
    } catch (error) {
      console.error("Error uploading size guide:", error);
      alert("Failed to upload size guide. Please try again.");
    }
  };

  // Handle product field changes
  const handleFieldChange = (
    field: keyof ProductType,
    value: string | number | boolean
  ) => {
    setProduct((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      // Auto-generate slug when name changes
      if (field === "name" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Handle product update
  const handleUpdateProduct = async () => {
    if (!existingProduct) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!product.name.trim()) {
        alert("Please enter a product name");
        return;
      }

      if (product.images.length === 0) {
        alert("Please add at least one image");
        return;
      }

      // Prepare variants data
      const variantsData = variants.map((v) => ({
        type: v.type,
        value: v.value,
        subvalue: v.subvalue,
        image: v.image,
      }));

      // Call the update mutation
      await updateProduct({
        id: existingProduct._id as Id<"products">,
        name: product.name,
        slug: product.slug,
        detail: product.detail,
        images: product.images,
        price: product.price,
        rating: product.rating,
        review: product.review,
        sold: product.sold,
        stock: product.stock,
        trending: product.trending,
        mostPopular: product.mostPopular,
        order: product.order,
        sizeGuide: product.sizeGuide,
        variants: variantsData,
      });

      // Delete existing reviews
      if (existingReviews) {
        for (const review of existingReviews) {
          if (review._id) {
            await deleteReview({ id: review._id });
          }
        }
      }

      // Create new reviews
      for (const review of reviews) {
        await createReview({
          productId: existingProduct._id as Id<"products">,
          userName: review.userName,
          userImage: review.userImage,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          reviewImages: review.reviewImages,
        });
      }

      alert("Product updated successfully!");
      router.push(`/product/${product.slug}`);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add variant
  const addVariant = () => {
    if (!newVariantValue.trim()) return;

    const newVariant: Variant = {
      type: newVariantType,
      value: newVariantValue,
      subvalue: newVariantSubvalue || undefined,
      image: newVariantImage || undefined,
    };

    setVariants([...variants, newVariant]);
    setNewVariantValue("");
    setNewVariantSubvalue("");
    setNewVariantImage("");
  };

  // Remove variant
  const removeVariant = (type: VariantType, value: string) => {
    setVariants(variants.filter((v) => v.type !== type || v.value !== value));
  };

  // Add review
  const addReview = () => {
    if (!newReviewUserName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      userName: newReviewUserName,
      userImage: newReviewUserImage || undefined,
      rating: newReviewRating,
      comment: newReviewComment,
      date: newReviewDate,
      reviewImages: newReviewImages.length > 0 ? newReviewImages : undefined,
    };

    setReviews([...reviews, newReview]);
    setNewReviewUserName("");
    setNewReviewUserImage("");
    setNewReviewRating(getRandomNumber(4, 5, true));
    setNewReviewComment("");
    setNewReviewDate(getRandomDateLastMonth());
    setNewReviewImages([]);
  };

  // Remove review
  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  // Get URLs for preview
  const previewUrls = useStorageUrls(product.images);

  // Show loading state
  if (existingProduct === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  // Show not found state
  if (existingProduct === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-500">
          The product you are trying to modify does not exist.
        </p>
      </div>
    );
  }

  if (!existingVariants) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading variants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold">Modify Product</h2>

          {/* Product Name and Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://dirtylinestudio.com/product/dirtyline-36daysoftype-2022/",
                      "_blank"
                    )
                  }
                >
                  click here for police formatting
                </span>
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            {/* Product Detail */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Detail{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://www.markdownguide.org/cheat-sheet/",
                      "_blank"
                    )
                  }
                >
                  (see syntax)
                </span>
              </label>
              <textarea
                value={product.detail}
                onChange={(e) => handleFieldChange("detail", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product detail"
              />
            </div>
          </div>

          {/* Rating, Sold, Stock in a row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={product.price || ""}
                onChange={(e) =>
                  handleFieldChange("price", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Star Rating (Max 5)
              </label>
              <input
                type="number"
                value={product.rating || ""}
                onChange={(e) =>
                  handleFieldChange("rating", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                value={product.review || ""}
                onChange={(e) =>
                  handleFieldChange("review", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number Sold
              </label>
              <input
                type="number"
                value={product.sold || ""}
                onChange={(e) =>
                  handleFieldChange("sold", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number in Stock
              </label>
              <input
                type="number"
                value={product.stock || ""}
                onChange={(e) =>
                  handleFieldChange("stock", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {product.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <StorageImage
                        storageId={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex w-5 h-5 items-center justify-center pb-[2px]"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Size Guide Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Size Guide</label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleSizeGuideUpload}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {product.sizeGuide && (
                <div className="relative w-20 h-20">
                  <StorageImage
                    storageId={product.sizeGuide}
                    alt="Size Guide Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() =>
                      setProduct((prev) => ({ ...prev, sizeGuide: undefined }))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex w-5 h-5 items-center justify-center pb-[2px]"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Variants Section */}
          <div className="mb-4 pt-2 border-t">
            <h3 className="text-lg font-semibold">Variants</h3>

            {/* Add Variant Form */}
            <div className="flex gap-2 mb-2">
              <select
                value={newVariantType}
                onChange={(e) =>
                  setNewVariantType(e.target.value as VariantType)
                }
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {variantTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newVariantValue}
                onChange={(e) => setNewVariantValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addVariant()}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter variant value"
              />
              <input
                type="text"
                value={newVariantSubvalue}
                onChange={(e) => setNewVariantSubvalue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addVariant()}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  newVariantType === "color"
                    ? "Hex (e.g. #FF0000)"
                    : "Subvalue (optional)"
                }
              />
              <select
                value={newVariantImage}
                onChange={(e) => setNewVariantImage(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={product.images.length === 0}
              >
                <option value="">No image</option>
                {product.images.map((img, index) => (
                  <option key={img} value={img}>
                    Image {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={addVariant}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2">
              {/* Variants List */}
              {variants.length > 0 &&
                variants.map((variant) => (
                  <div
                    key={variant.type + variant.value}
                    className="flex items-center justify-between bg-foreground/30 p-2 rounded-md mr-2"
                  >
                    <div className="flex items-center gap-2">
                      {variant.image && (
                        <StorageImage
                          storageId={variant.image}
                          alt={variant.value}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      {variant.type === "color" && variant.subvalue && (
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: variant.subvalue }}
                        />
                      )}
                      <div>
                        <span className="text-sm text-gray-700">
                          {variant.type}:
                        </span>{" "}
                        {variant.value}
                        {variant.subvalue && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({variant.subvalue})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeVariant(variant.type, variant.value)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-4 pt-2 border-t">
            <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>

            {/* Add Review Form */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newReviewUserName}
                  onChange={(e) => setNewReviewUserName(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="User name"
                />
                <input
                  type="number"
                  value={newReviewRating}
                  onChange={(e) =>
                    setNewReviewRating(
                      Math.max(0, Math.min(5, parseFloat(e.target.value) || 0))
                    )
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rating (0-5)"
                  min="0"
                  max="5"
                  step="0.1"
                />
                <input
                  type="text"
                  value={newReviewDate}
                  onChange={(e) => setNewReviewDate(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Date (e.g., January 1, 2024)"
                />
              </div>
              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Review comment"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    User Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReviewUserImageUpload}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  {newReviewUserImage && (
                    <div className="mt-2 relative inline-block">
                      <StorageImage
                        storageId={newReviewUserImage}
                        alt="User preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <button
                        onClick={() => setNewReviewUserImage("")}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Customer Product Photos (Product received by customer)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleReviewImagesUpload}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  {newReviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newReviewImages.map((img, index) => (
                        <div key={index} className="relative">
                          <StorageImage
                            storageId={img}
                            alt={`Review preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <button
                            onClick={() => removeReviewImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={addReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Review
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 && (
              <div className="space-x-3 flex">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-md relative flex-1"
                  >
                    <button
                      onClick={() => removeReview(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-3">
                      {review.userImage ? (
                        <StorageImage
                          storageId={review.userImage}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 font-semibold">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between w-full">
                          <span className="font-semibold">
                            {review.userName}
                          </span>
                          <span className="text-sm text-gray-500 px-4">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {review.date}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          {review.reviewImages &&
                            review.reviewImages.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {review.reviewImages.map((img, imgIndex) => (
                                  <StorageImage
                                    key={imgIndex}
                                    storageId={img}
                                    alt={`Review image ${imgIndex + 1}`}
                                    className="w-16 h-16 object-cover rounded border"
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Update Product Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdateProduct}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {product.images.length > 0 ? (
            previewUrls ? (
              <>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/2">
                    <Carroussel images={previewUrls} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Product product={product} variants={variants} />
                  </div>
                </div>
                {/* Reviews Preview */}
                {reviews.length > 0 && (
                  <div className="mt-8">
                    <Reviews reviews={reviews} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                <p className="text-gray-500">Loading preview...</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
              <p className="text-gray-500">
                Upload images to see product preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
