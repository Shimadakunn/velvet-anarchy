"use client";

import Carroussel from "@/components/Carroussel";
import Reviews from "@/components/Reviews";
import StorageImage from "@/components/StorageImage";
import { api } from "@/convex/_generated/api";
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
import { useMutation } from "convex/react";
import { Upload, X } from "lucide-react";
import { useState } from "react";

export default function AddProductPage() {
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createReview = useMutation(api.reviews.create);

  const [product, setProduct] = useState<ProductType>({
    name: "",
    slug: "",
    detail: "",
    images: [],
    price: 0,
    rating: getRandomNumber(4, 5, true),
    review: getRandomNumber(20, 500),
    sold: getRandomNumber(100, 1000),
    stock: getRandomNumber(1, 30),
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
  const [newVariantLink, setNewVariantLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<
    Omit<Review, "_id" | "productId" | "_creationTime">[]
  >([]);
  const [newReviewUserName, setNewReviewUserName] = useState("");
  const [newReviewUserImage, setNewReviewUserImage] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState(
    getRandomNumber(4, 5, false, 0.5)
  );
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewDate, setNewReviewDate] = useState(getRandomDateLastMonth());
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);

  // Drag and drop state
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );

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

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (dropIndex: number) => {
    if (draggedImageIndex === null) return;

    const newImages = [...product.images];
    const draggedImage = newImages[draggedImageIndex];

    // Remove from old position
    newImages.splice(draggedImageIndex, 1);
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);

    setProduct((prev) => ({
      ...prev,
      images: newImages,
    }));

    setDraggedImageIndex(null);
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

  // Handle product submission
  const handleAddProduct = async () => {
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
        variantLink: v.variantLink,
      }));

      // Call the mutation
      const productId = await createProduct({
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

      // Create reviews for the product
      for (const review of reviews) {
        await createReview({
          productId,
          userName: review.userName,
          userImage: review.userImage,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          reviewImages: review.reviewImages,
        });
      }

      alert(`Product added successfully! ID: ${productId}`);

      // Reset form
      setProduct({
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
      setVariants([]);
      setReviews([]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
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
      variantLink: newVariantLink || undefined,
    };

    setVariants([...variants, newVariant]);
    setNewVariantValue("");
    setNewVariantSubvalue("");
    setNewVariantImage("");
    setNewVariantLink("");
  };

  // Remove variant
  const removeVariant = (type: VariantType, value: string) => {
    setVariants(variants.filter((v) => v.type !== type || v.value !== value));
  };

  // Add review
  const addReview = () => {
    if (!newReviewUserName.trim() || !newReviewComment.trim()) return;

    const newReview = {
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
    setNewReviewRating(getRandomNumber(4, 5, false, 0.5));
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

  // Update product with variants for preview
  const productWithVariants = {
    ...product,
    images: previewUrls || product.images,
    variants,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold">Product</h2>

          {/* Product Name and Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name{" "}
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
          <label className="block text-sm font-medium mb-2">
            Product Images (Drag to reorder)
          </label>
          <div className="mb-4 flex items-start gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mb-3">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {product.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className="relative w-24 h-24 cursor-move hover:opacity-75 transition-opacity group"
                  >
                    <StorageImage
                      storageId={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded border-2 border-gray-200"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Size Guide Upload */}
          <label className="block text-sm font-medium mb-2">
            Size Guide (Optional)
          </label>
          <div className="mb-4 flex items-start gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mb-3">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload Size Guide</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSizeGuideUpload}
                className="hidden"
              />
            </label>
            {product.sizeGuide && (
              <div className="relative w-24 h-24 group">
                <StorageImage
                  storageId={product.sizeGuide}
                  alt="Size Guide Preview"
                  className="w-full h-full object-cover rounded border-2 border-gray-200"
                />
                <button
                  onClick={() =>
                    setProduct((prev) => ({ ...prev, sizeGuide: undefined }))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="mb-4 pt-2 border-t">
            <h3 className="text-lg font-semibold">Variants</h3>

            {/* Add Variant Form */}
            <div className="flex gap-2">
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
              {newVariantType === "color" && (
                <input
                  type="text"
                  value={newVariantLink}
                  onChange={(e) => setNewVariantLink(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addVariant()}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Variant Link (optional, e.g., product URL)"
                />
              )}
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

            {/* Variants List */}
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {variants.map((variant) => (
                  <div
                    key={variant.type + variant.value}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md group hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {variant.image && (
                        <StorageImage
                          storageId={variant.image}
                          alt={variant.value}
                          className="w-8 h-8 object-cover rounded border border-gray-300"
                        />
                      )}
                      {variant.type === "color" && variant.subvalue && (
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: variant.subvalue }}
                        />
                      )}
                      <div>
                        <span className="text-xs text-gray-600 uppercase font-medium">
                          {variant.type}:
                        </span>{" "}
                        <span className="text-sm">{variant.value}</span>
                        {variant.subvalue && variant.type !== "color" && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({variant.subvalue})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeVariant(variant.type, variant.value)}
                      className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  step="0.5"
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
                  <label className="block text-sm font-medium mb-2">
                    User Profile Image (Optional)
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Profile Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewUserImageUpload}
                      className="hidden"
                    />
                  </label>
                  {newReviewUserImage && (
                    <div className="inline-block group">
                      <StorageImage
                        storageId={newReviewUserImage}
                        alt="User preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        onClick={() => setNewReviewUserImage("")}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Product Photos (Optional)
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Product Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleReviewImagesUpload}
                      className="hidden"
                    />
                  </label>
                  {newReviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {newReviewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <StorageImage
                            storageId={img}
                            alt={`Review preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeReviewImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
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
              <div className="flex flex-wrap gap-3">
                {[...reviews]
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md relative group hover:bg-gray-100 transition-colors flex-1 min-w-[300px]"
                    >
                      <button
                        onClick={() => removeReview(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="flex items-start gap-3">
                        {review.userImage ? (
                          <StorageImage
                            storageId={review.userImage}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                            <span className="text-gray-600 font-semibold text-lg">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900">
                              {review.userName}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ⭐ {review.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {review.date}
                          </p>
                          <p className="text-gray-700 text-sm mb-3">
                            {review.comment}
                          </p>
                          {review.reviewImages &&
                            review.reviewImages.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {review.reviewImages.map((img, imgIndex) => (
                                  <StorageImage
                                    key={imgIndex}
                                    storageId={img}
                                    alt={`Review image ${imgIndex + 1}`}
                                    className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddProduct}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
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
                {reviews.length > 0 && product._id && (
                  <div className="mt-8">
                    <Reviews reviews={reviews} productId={product._id} />
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
