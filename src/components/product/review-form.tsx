"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Star, Loader2, Upload } from "lucide-react";
import type { Review } from "./product-reviews";

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: Review) => void;
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload these to a storage service
      // Here we'll just create local URLs for demo purposes
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      setError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you'd send this to your API
      // For demo purposes, we'll create a mock review
      const newReview: Review = {
        id: `rev${Date.now()}`, // Mock ID
        productId,
        userId: "currentUser123", // This would come from auth
        userName: "Current User", // This would come from auth
        userAvatar: "/placeholder.svg?height=40&width=40", // This would come from auth
        rating,
        comment,
        date: new Date().toISOString(),
        helpful: 0,
        verifiedPurchase: true,
        images: images.length > 0 ? images : undefined,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(newReview);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-100 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="block">
              Your Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review" className="block">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] border-green-200 dark:border-green-800"
              placeholder="Share your experience with this product. What did you like or dislike?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="block">
              Add Images (Optional)
            </Label>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group h-20 w-20 rounded-md overflow-hidden border border-muted"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 h-5 w-5 p-0"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <div className="h-20 w-20 relative border-2 border-dashed border-muted rounded-md flex items-center justify-center overflow-hidden">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
