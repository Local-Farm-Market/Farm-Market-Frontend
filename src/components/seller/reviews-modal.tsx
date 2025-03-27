"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Star, Calendar, ThumbsUp } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

// Mock review data
const mockReviews = [
  {
    id: "1",
    customerName: "Sarah M.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "The tomatoes were incredibly fresh and flavorful. Will definitely order again!",
    date: "2023-05-15",
    productName: "Fresh Organic Tomatoes",
    helpful: 12,
    reply:
      "Thank you for your kind words, Sarah! We're glad you enjoyed our tomatoes.",
  },
  {
    id: "2",
    customerName: "Michael T.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment: "Great quality beef, but delivery was a bit delayed.",
    date: "2023-05-10",
    productName: "Grass-Fed Beef",
    helpful: 8,
    reply: "",
  },
  {
    id: "3",
    customerName: "Emily R.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "These eggs are amazing! You can really taste the difference with free-range chickens.",
    date: "2023-05-08",
    productName: "Organic Free-Range Eggs",
    helpful: 15,
    reply:
      "Thanks Emily! Our chickens are raised with lots of space to roam and a natural diet.",
  },
  {
    id: "4",
    customerName: "David K.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 3,
    comment: "The strawberries were good but some were a bit overripe.",
    date: "2023-05-05",
    productName: "Fresh Strawberries",
    helpful: 4,
    reply:
      "We're sorry to hear that, David. We'll make sure to improve our quality control.",
  },
  {
    id: "5",
    customerName: "Jessica L.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "The goat cheese is absolutely divine! Creamy and tangy, just perfect.",
    date: "2023-05-03",
    productName: "Artisanal Goat Cheese",
    helpful: 18,
    reply: "",
  },
  {
    id: "6",
    customerName: "Robert P.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment: "Very good quinoa, cooks perfectly and has a nice texture.",
    date: "2023-04-28",
    productName: "Organic Quinoa",
    helpful: 7,
    reply:
      "Thank you for your feedback, Robert! We're glad you enjoyed our quinoa.",
  },
  {
    id: "7",
    customerName: "Amanda S.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "The tomatoes were so flavorful! Much better than what I find at the supermarket.",
    date: "2023-04-25",
    productName: "Fresh Organic Tomatoes",
    helpful: 9,
    reply: "",
  },
  {
    id: "8",
    customerName: "Thomas B.",
    customerAvatar: "/placeholder.svg?height=100&width=100",
    rating: 2,
    comment:
      "The beef was tough and not as described. Disappointed with this purchase.",
    date: "2023-04-20",
    productName: "Grass-Fed Beef",
    helpful: 3,
    reply:
      "We're very sorry to hear about your experience, Thomas. Please contact us directly so we can make this right.",
  },
];

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewsModal({ open, onOpenChange }: ReviewsModalProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Filter and sort reviews
  const filteredReviews = mockReviews
    .filter((review) => {
      if (activeTab === "all") return true;
      if (activeTab === "positive") return review.rating >= 4;
      if (activeTab === "negative") return review.rating <= 3;
      if (activeTab === "unanswered") return !review.reply;
      return true;
    })
    .filter((review) => {
      if (!searchQuery) return true;
      return (
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "helpful") {
        return b.helpful - a.helpful;
      }
      return 0;
    });

  const handleReply = (reviewId: string) => {
    if (replyingTo === reviewId) {
      // Submit reply
      setReplyingTo(null);
      setReplyText("");
    } else {
      // Start replying
      setReplyingTo(reviewId);
      setReplyText("");
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" />
            Customer Reviews
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                <span className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                  4.8
                </span>
              </div>
              <div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {mockReviews.length} reviews
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback>
                            {review.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{review.customerName}</h4>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {review.productName}
                      </Badge>
                    </div>

                    <p className="text-sm">{review.comment}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-7 gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>

                    {review.reply && (
                      <div className="bg-muted p-3 rounded-md mt-2">
                        <p className="text-xs font-medium mb-1">
                          Your Response:
                        </p>
                        <p className="text-sm">{review.reply}</p>
                      </div>
                    )}

                    {replyingTo === review.id ? (
                      <div className="mt-2 space-y-2">
                        <Input
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReply(review.id)}
                          >
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReply(review.id)}
                        className="mt-2"
                        disabled={!!review.reply}
                      >
                        {review.reply ? "Already Replied" : "Reply to Review"}
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found matching your criteria.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
