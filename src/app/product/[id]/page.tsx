"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { MapPin, User, ShoppingCart, ArrowLeft, Calendar } from "lucide-react";
import { QrVerification } from "@/src/components/product/qr-verification";
import { TransactionTracker } from "@/src/components/escrow/transaction-tracker";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { useUserRole } from "@/src/hooks/use-user-role";
import { AddToCartButton } from "@/src/components/product/add-to-cart-button";
import { ProductReviews } from "@/src/components/product/product-reviews";
import { StarRatingDisplay } from "@/src/components/product/star-rating-display";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { useProducts } from "@/src/hooks/use-products";
import {
  FARM_ESCROW_ABI,
  FARM_ESCROW_ADDRESS,
} from "@/src/lib/contract-config";
import type { FormattedProduct } from "@/src/lib/types";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { role } = useUserRole();
  const { fetchProductById } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [product, setProduct] = useState<FormattedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch product data from contract
        const productData = await fetchProductById(params.id);

        if (!productData) {
          router.push("/marketplace");
          return;
        }

        setProduct(productData);
        setTotalPrice(productData.price * quantity);

        // Fetch seller profile using the API route
        const response = await fetch("/api/read-contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: FARM_ESCROW_ADDRESS,
            abi: FARM_ESCROW_ABI,
            functionName: "userProfiles",
            args: [productData.seller],
          }),
        });

        const { result: sellerData } = await response.json();

        if (sellerData) {
          setSellerProfile(sellerData);
          productData.location = `${sellerData.farmName}, ${sellerData.location}`;
          productData.sellerName = sellerData.name;
          setProduct({ ...productData });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/marketplace");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, fetchProductById]);

  // Update total price when quantity changes
  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleBuy = () => {
    setOrderPlaced(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  if (!product) {
    return null; // Will redirect via useEffect
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="py-6 max-w-4xl mx-auto">
        <DashboardHeader title={product.name} />

        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <Image
                src={product.imageUrls[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isOrganic && (
                <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                  Organic
                </Badge>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.imageUrls.map((image: string, index: number) => (
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
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {product.location || "Unknown location"}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                for {quantity} {product.unit} ({product.price.toFixed(2)} per{" "}
                {product.unit})
              </p>
              <Badge
                variant={
                  product.isAvailable && product.stockQuantity > 0
                    ? "default"
                    : "secondary"
                }
                className={
                  product.isAvailable && product.stockQuantity > 0
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }
              >
                {product.isAvailable && product.stockQuantity > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </Badge>
            </div>

            <p className="mt-4">{product.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Farmer: {sellerProfile?.name || "Unknown"}</span>
              </div>
              {sellerProfile && (
                <div className="flex items-center gap-2">
                  <StarRatingDisplay
                    rating={Number(sellerProfile.rating) / 10}
                    size="sm"
                    showValue={true}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Harvested: {new Date().toLocaleDateString()}</span>
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
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </Button>
              </div>

              {role === "buyer" &&
              product.isAvailable &&
              product.stockQuantity > 0 ? (
                <>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleBuy}
                    disabled={orderPlaced}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {orderPlaced ? "Order Placed" : "Buy Now"}
                  </Button>

                  <AddToCartButton
                    product={product}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    variant="outline"
                  />
                </>
              ) : (
                <Button
                  className="flex-1 gap-2"
                  onClick={handleBuy}
                  disabled={
                    !product.isAvailable ||
                    product.stockQuantity <= 0 ||
                    orderPlaced ||
                    role !== "buyer"
                  }
                >
                  <ShoppingCart className="h-4 w-4" />
                  {role !== "buyer"
                    ? "Switch to Buyer Account"
                    : orderPlaced
                    ? "Order Placed"
                    : "Buy Now"}
                </Button>
              )}
            </div>

            <div className="mt-6">
              <QrVerification
                productId={product.id}
                farmerId={product.seller}
                productName={product.name}
                harvestDate={new Date().toISOString()}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              {orderPlaced && (
                <TabsTrigger value="order">Order Status</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <span>{product.isOrganic ? "Yes" : "No"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Available Quantity:
                          </span>
                          <span>
                            {product.stockQuantity} {product.unit}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Sold:</span>
                          <span>
                            {product.soldCount} {product.unit}
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

            <TabsContent value="reviews" className="space-y-4">
              <ProductReviews productId={product.id} />
            </TabsContent>

            <TabsContent value="farmer" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  {sellerProfile ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src="/placeholder.svg"
                            alt={sellerProfile.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{sellerProfile.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span>⭐</span>
                            <span>
                              {Number(sellerProfile.rating) / 10} Rating
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mb-6">{sellerProfile.bio}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                            Farm Details
                          </h4>
                          <p className="text-sm">
                            {sellerProfile.farmDescription}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                            Location
                          </h4>
                          <p className="text-sm">{sellerProfile.location}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Farmer information not available</p>
                  )}
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
