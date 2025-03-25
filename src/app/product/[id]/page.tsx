"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  MapPin,
  Calendar,
  User,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import { QrVerification } from "@/src/components/product/qr-verification";
import { TransactionTracker } from "@/src/components/escrow/transaction-tracker";
import { DisputeButton } from "@/src/components/escrow/dispute-button";
import { ChatInterface } from "@/src/components/chat/chat-interface";
import { ProtectedRoute } from "@/src/components/auth/protected-route";

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Fresh Organic Tomatoes",
    price: 3.99,
    description:
      "Delicious, vine-ripened organic tomatoes grown without pesticides or chemical fertilizers. These tomatoes are harvested at peak ripeness to ensure the best flavor and nutritional value.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Green Valley Farm, California",
    farmer: {
      id: "farmer123",
      name: "John Smith",
      rating: 4.8,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: true,
    quantity: 20,
    unit: "lb",
    category: "Vegetables",
    harvestDate: "2023-05-15",
    organic: true,
    nutritionFacts: {
      calories: 22,
      protein: "1.1g",
      carbs: "4.8g",
      fat: "0.2g",
      fiber: "1.5g",
    },
  },
  {
    id: "2",
    title: "Grass-Fed Beef",
    price: 12.99,
    description:
      "Premium grass-fed beef raised on open pastures without hormones or antibiotics. Our cattle are raised with ethical farming practices, resulting in leaner, more flavorful meat that's better for you and the environment.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Sunset Ranch, Texas",
    farmer: {
      id: "farmer456",
      name: "Robert Johnson",
      rating: 4.9,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: true,
    quantity: 15,
    unit: "lb",
    category: "Meat",
    harvestDate: "2023-05-10",
    organic: false,
    nutritionFacts: {
      calories: 250,
      protein: "26g",
      carbs: "0g",
      fat: "17g",
      fiber: "0g",
    },
  },
  {
    id: "3",
    title: "Organic Free-Range Eggs",
    price: 5.49,
    description:
      "Farm-fresh organic eggs from free-range chickens. Our hens roam freely on pasture, eating a natural diet supplemented with organic feed, resulting in eggs with rich, golden yolks and superior flavor.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Happy Hen Farm, Oregon",
    farmer: {
      id: "farmer789",
      name: "Sarah Williams",
      rating: 4.7,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: true,
    quantity: 30,
    unit: "dozen",
    category: "Poultry",
    harvestDate: "2023-05-18",
    organic: true,
    nutritionFacts: {
      calories: 70,
      protein: "6g",
      carbs: "0g",
      fat: "5g",
      fiber: "0g",
    },
  },
  {
    id: "4",
    title: "Fresh Strawberries",
    price: 4.99,
    description:
      "Sweet, juicy strawberries picked at the peak of ripeness. Our berries are grown using sustainable farming practices and are perfect for snacking, baking, or making preserves.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Berry Fields, Washington",
    farmer: {
      id: "farmer101",
      name: "Emily Davis",
      rating: 4.6,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: false,
    quantity: 0,
    unit: "lb",
    category: "Fruits",
    harvestDate: "2023-05-12",
    organic: true,
    nutritionFacts: {
      calories: 32,
      protein: "0.7g",
      carbs: "7.7g",
      fat: "0.3g",
      fiber: "2g",
    },
  },
  {
    id: "5",
    title: "Artisanal Goat Cheese",
    price: 8.99,
    description:
      "Creamy, tangy goat cheese made in small batches from the milk of our own pasture-raised goats. Our traditional cheese-making process creates a product with exceptional flavor and texture.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Mountain Dairy, Vermont",
    farmer: {
      id: "farmer202",
      name: "Michael Brown",
      rating: 4.9,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: true,
    quantity: 12,
    unit: "oz",
    category: "Dairy",
    harvestDate: "2023-05-08",
    organic: true,
    nutritionFacts: {
      calories: 120,
      protein: "6g",
      carbs: "0g",
      fat: "10g",
      fiber: "0g",
    },
  },
  {
    id: "6",
    title: "Organic Quinoa",
    price: 6.99,
    description:
      "Nutrient-rich organic quinoa grown using sustainable farming practices. This versatile ancient grain is a complete protein source and makes a perfect base for salads, bowls, and side dishes.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    location: "Golden Fields, Idaho",
    farmer: {
      id: "farmer303",
      name: "David Wilson",
      rating: 4.7,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    available: true,
    quantity: 25,
    unit: "lb",
    category: "Grains",
    harvestDate: "2023-04-20",
    organic: true,
    nutritionFacts: {
      calories: 120,
      protein: "4g",
      carbs: "21g",
      fat: "1.9g",
      fiber: "2.8g",
    },
  },
];

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [totalPrice, setTotalPrice] = useState(3.99);

  // Find the product with the matching ID
  const product =
    mockProducts.find((p) => p.id === productId) || mockProducts[0];

  // Update total price when quantity changes
  useEffect(() => {
    setTotalPrice(product.price * quantity);
  }, [quantity, product.price]);

  const handleBuy = () => {
    setOrderPlaced(true);
  };

  const handleDisputeSubmit = (orderId: string, reason: string) => {
    console.log(`Dispute submitted for order ${orderId}: ${reason}`);
    // In a real app, this would submit the dispute to the backend
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.organic && (
                <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                  Organic
                </Badge>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{product.location}</span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                for {quantity} {product.unit} ({product.price.toFixed(2)} per{" "}
                {product.unit})
              </p>
              <Badge
                variant={product.available ? "default" : "secondary"}
                className={
                  product.available
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }
              >
                {product.available ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <p className="mt-4">{product.description}</p>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Farmer: {product.farmer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Harvested:{" "}
                  {new Date(product.harvestDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.quantity}
                >
                  +
                </Button>
              </div>
              <Button
                className="flex-1 gap-2"
                onClick={handleBuy}
                disabled={!product.available || orderPlaced}
              >
                <ShoppingCart className="h-4 w-4" />
                {orderPlaced ? "Order Placed" : "Buy Now"}
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </div>

            <div className="mt-6">
              <QrVerification
                productId={product.id}
                farmerId={product.farmer.id}
                productName={product.title}
                harvestDate={product.harvestDate}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              {orderPlaced && (
                <TabsTrigger value="order">Order Status</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Product Details</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span>{product.category}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Organic:
                          </span>
                          <span>{product.organic ? "Yes" : "No"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Harvest Date:
                          </span>
                          <span>
                            {new Date(product.harvestDate).toLocaleDateString()}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Available Quantity:
                          </span>
                          <span>
                            {product.quantity} {product.unit}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Storage Instructions</h3>
                      <p className="text-sm">
                        Store at room temperature away from direct sunlight.
                        Refrigerate after cutting for up to 3 days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">
                    Nutrition Facts (per 100g)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(product.nutritionFacts).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="text-center p-4 bg-muted rounded-lg"
                        >
                          <p className="text-lg font-bold">{value}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {key}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="farmer" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={product.farmer.avatar || "/placeholder.svg"}
                        alt={product.farmer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.farmer.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span>⭐</span>
                        <span>{product.farmer.rating} Rating</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-6">
                    John Smith has been farming organically for over 15 years.
                    His farm is certified organic and uses sustainable farming
                    practices to grow the highest quality produce.
                  </p>
                  <ChatInterface
                    recipientName={product.farmer.name}
                    recipientAvatar={product.farmer.avatar}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {orderPlaced && (
              <TabsContent value="order" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-6">Order Status</h3>
                    <TransactionTracker status="payment_escrowed" />

                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Order #12345</h4>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <DisputeButton
                          orderId="12345"
                          onDisputeSubmit={handleDisputeSubmit}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span>
                            Price ({quantity} {product.unit})
                          </span>
                          <span>${(product.price * quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Shipping</span>
                          <span>$5.00</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>
                            ${(product.price * quantity + 5).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
