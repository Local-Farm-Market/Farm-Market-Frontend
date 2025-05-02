"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Star, ThumbsUp, Filter } from "lucide-react";
import { ReviewForm } from "./review-form";
import { useUserRole } from "@/src/hooks/use-user-role";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verifiedPurchase: boolean;
  images?: string[];
}

interface ProductReviewsProps {
  productId: string;
  initialReviews?: Review[];
}

// Mock reviews data for demonstration
const mockReviews: Review[] = [
  {
    id: "rev1",
    productId: "1",
    userId: "buyer123",
    userName: "Sarah Miller",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "The tomatoes were incredibly fresh and flavorful. The taste reminds me of the ones from my grandmother's garden - truly authentic and organic. Will definitely order again!",
    date: "2023-05-15",
    helpful: 12,
    verifiedPurchase: true,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: "rev2",
    productId: "1",
    userId: "buyer456",
    userName: "Michael Thompson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Good quality tomatoes, but a few were slightly bruised during shipping. Overall very tasty and fresh compared to grocery store options.",
    date: "2023-05-10",
    helpful: 8,
    verifiedPurchase: true,
  },
  {
    id: "rev3",
    productId: "2",
    userId: "buyer789",
    userName: "Jessica Williams",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "This beef is exceptionally good! Very tender and flavorful. You can really taste the difference with grass-fed.",
    date: "2023-05-12",
    helpful: 15,
    verifiedPurchase: true,
    images: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  },
  {
    id: "rev4",
    productId: "1",
    userId: "buyer321",
    userName: "David Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    comment:
      "The tomatoes were okay, but not as flavorful as I expected from organic produce. Some were a bit overripe upon arrival.",
    date: "2023-05-03",
    helpful: 4,
    verifiedPurchase: true,
  },
];

export function ProductReviews({
  productId,
  initialReviews,
}: ProductReviewsProps) {
  const { role } = useUserRole();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortOption, setSortOption] = useState<string>("recent");
  const [filterOption, setFilterOption] = useState<string>("all");
  const [reviews, setReviews] = useState<Review[]>(
    initialReviews ||
      mockReviews.filter((review) => review.productId === productId)
  );
  const [helpfulMarked, setHelpfulMarked] = useState<Record<string, boolean>>(
    {}
  );

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Rating distribution
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else if (sortOption === "lowest") {
      return a.rating - b.rating;
    } else if (sortOption === "helpful") {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  // Filter reviews
  const filteredReviews = sortedReviews.filter((review) => {
    if (filterOption === "all") return true;
    if (filterOption === "positive" && review.rating >= 4) return true;
    if (filterOption === "critical" && review.rating <= 3) return true;
    if (
      filterOption === "with-images" &&
      review.images &&
      review.images.length > 0
    )
      return true;
    if (filterOption === "verified" && review.verifiedPurchase) return true;
    return false;
  });

  const handleAddReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
  };

  const handleMarkHelpful = (reviewId: string) => {
    if (helpfulMarked[reviewId]) return;

    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
    setHelpfulMarked({ ...helpfulMarked, [reviewId]: true });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-amber-100 dark:border-amber-900/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600" />
              Customer Reviews ({reviews.length})
            </span>
            {role === "buyer" && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showReviewForm ? (
            <ReviewForm productId={productId} onSubmit={handleAddReview} />
          ) : (
            <>
              {/* Review Summary */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-amber-800 dark:text-amber-300">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex mb-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="text-sm min-w-[30px]">{rating} ★</div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{
                            width: `${
                              reviews.length
                                ? (ratingCounts[
                                    rating as keyof typeof ratingCounts
                                  ] /
                                    reviews.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-sm min-w-[40px]">
                        {ratingCounts[rating as keyof typeof ratingCounts] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter and Sort */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterOption} onValueChange={setFilterOption}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="positive">Positive (4-5★)</SelectItem>
                    <SelectItem value="critical">Critical (1-3★)</SelectItem>
                    <SelectItem value="with-images">With Images</SelectItem>
                    <SelectItem value="verified">Verified Purchases</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews List */}
              {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-amber-100 dark:border-amber-900/50 pb-6 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.userAvatar || "/placeholder.svg"}
                              alt={review.userName}
                            />
                            <AvatarFallback>
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.verifiedPurchase && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
                          >
                            Verified Purchase
                          </Badge>
                        )}
                      </div>

                      <p className="mb-4">{review.comment}</p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-3 mb-4 overflow-x-auto">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-muted"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Review image ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkHelpful(review.id)}
                        disabled={helpfulMarked[review.id]}
                        className="text-muted-foreground"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {helpfulMarked[review.id]
                          ? "Marked as helpful"
                          : "Helpful"}{" "}
                        ({review.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    No reviews match your filter criteria.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
