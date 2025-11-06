"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StorageImage from "@/components/StorageImage";
import { trackReviewAdded } from "@/lib/analytics";

interface AddReviewDialogProps {
  productId: Id<"products">;
  productName?: string;
  children: React.ReactNode;
}

export default function AddReviewDialog({
  productId,
  productName = "",
  children,
}: AddReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"verify" | "review">("verify");
  const [loading, setLoading] = useState(false);

  // Verification step
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");

  // Review step
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userImage, setUserImage] = useState<string>("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const createReview = useMutation(api.reviews.createWithVerification);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Set default username from email when moving to review step
  useEffect(() => {
    if (step === "review" && email && !userName) {
      const emailPrefix = email.split("@")[0];
      setUserName(emailPrefix);
    }
  }, [step, email, userName]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set default username from email
      const emailPrefix = email.split("@")[0];
      setUserName(emailPrefix);

      // Move to review step - verification will happen when submitting the review
      setStep("review");
      toast.success("Please fill in your review");
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle user image upload
  const handleUserImageUpload = async (
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
      setUserImage(storageId);
      toast.success("Profile image uploaded");
    } catch (error) {
      console.error("Error uploading user image:", error);
      toast.error("Failed to upload profile image");
    }
  };

  // Handle review images upload
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
      setReviewImages([...reviewImages, ...storageIds]);
      toast.success(`${storageIds.length} image(s) uploaded`);
    } catch (error) {
      console.error("Error uploading review images:", error);
      toast.error("Failed to upload images");
    }
  };

  // Remove review image
  const removeReviewImage = (index: number) => {
    setReviewImages(reviewImages.filter((_: string, i: number) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (rating === 0 || rating < 0.5) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setLoading(true);

    try {
      await createReview({
        email,
        orderId,
        productId,
        userName: userName.trim(),
        userImage: userImage || undefined,
        rating,
        comment: comment.trim(),
        reviewImages: reviewImages.length > 0 ? reviewImages : undefined,
      });

      toast.success("Review submitted successfully!");

      // Track review added
      trackReviewAdded(productId, productName, rating);

      // Reset form
      setEmail("");
      setOrderId("");
      setUserName("");
      setRating(5);
      setComment("");
      setUserImage("");
      setReviewImages([]);
      setStep("verify");
      setOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after animation
    setTimeout(() => {
      setStep("verify");
      setEmail("");
      setOrderId("");
      setUserName("");
      setRating(5);
      setComment("");
      setUserImage("");
      setReviewImages([]);
    }, 300);
  };

  // Handle star click for half ratings
  const handleStarClick = (
    star: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const starWidth = rect.width;

    // If clicked on left half, set half star, otherwise full star
    if (clickX < starWidth / 2) {
      setRating(star - 0.5);
    } else {
      setRating(star);
    }
  };

  // Handle star hover for visual feedback
  const handleStarHover = (
    star: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const starWidth = rect.width;

    if (hoverX < starWidth / 2) {
      setHoveredRating(star - 0.5);
    } else {
      setHoveredRating(star);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) =>
        isOpen ? setOpen(true) : handleClose()
      }
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "verify" ? (
          <>
            <DialogHeader>
              <DialogTitle>Verify Your Purchase</DialogTitle>
              <DialogDescription>
                Enter your email and order number to verify your purchase
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-medium mb-2"
                >
                  Order Number
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  placeholder="6A555697G32379614"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer px-2 md:py-1 py-2"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-2 md:py-1 py-2"
                >
                  {loading ? "Verifying..." : "Continue"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Write Your Review</DialogTitle>
              <DialogDescription>
                Share your experience with this product
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUserImageUpload}
                      className="hidden"
                    />
                  </label>
                  {userImage && (
                    <div className="relative">
                      <StorageImage
                        storageId={userImage}
                        alt="Profile preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setUserImage("")}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const displayRating = hoveredRating || rating;
                    const isFull = star <= Math.floor(displayRating);
                    const isHalf =
                      star === Math.ceil(displayRating) &&
                      displayRating % 1 !== 0;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={(e) => handleStarClick(star, e)}
                        onMouseMove={(e) => handleStarHover(star, e)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="relative transition-transform hover:scale-110"
                      >
                        {isHalf ? (
                          <div className="relative w-8 h-8">
                            <Star className="w-8 h-8 text-gray-300 absolute" />
                            <div className="overflow-hidden absolute w-1/2">
                              <Star className="w-8 h-8 fill-black text-black" />
                            </div>
                          </div>
                        ) : (
                          <Star
                            className={`w-8 h-8 ${
                              isFull ? "fill-black text-black" : "text-gray-300"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium mb-2"
                >
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us about your experience with this product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Photos (Optional)
                </label>
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-fit">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleReviewImagesUpload}
                    className="hidden"
                  />
                </label>
                {reviewImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {reviewImages.map((img: string, index: number) => (
                      <div key={index} className="relative">
                        <StorageImage
                          storageId={img}
                          alt={`Product photo ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeReviewImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer px-2 md:py-1 py-2"
                  onClick={() => setStep("verify")}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-2 md:py-1 py-2"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
