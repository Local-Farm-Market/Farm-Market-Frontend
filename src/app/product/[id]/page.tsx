// app/product/[id]/page.tsx
"use client"

import { useState, useEffect, useMemo, Suspense, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { MapPin, User, ShoppingCart, ArrowLeft, Calendar } from 'lucide-react'
import { QrVerification } from "@/src/components/product/qr-verification"
import { TransactionTracker } from "@/src/components/escrow/transaction-tracker"
import { ProtectedRoute } from "@/src/components/auth/protected-route"
import { useUserRole } from "@/src/hooks/use-user-role"
import { AddToCartButton } from "@/src/components/product/add-to-cart-button"
import { ProductReviews } from "@/src/components/product/product-reviews"
import { StarRatingDisplay } from "@/src/components/product/star-rating-display"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { useProducts } from "@/src/hooks/use-products"
import { FARM_ESCROW_ADDRESS } from "@/src/lib/contract-config"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { ProductDetailSkeleton } from "@/src/components/product/product-detail-skeleton"
import useSWR from "swr"
import type { FormattedProduct } from "@/src/lib/types"

// Fetch product and seller data in a single API call
const fetchProductWithSeller = async (productId: string) => {
  const response = await fetch(`/api/product/${productId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }
  return response.json()
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { role } = useUserRole()
  const [quantity, setQuantity] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  // Fetch product with SWR for caching and revalidation
  const { data, error, isLoading } = useSWR(
    `product-${params.id}`,
    () => fetchProductWithSeller(params.id),
    {
      revalidateOnFocus: false,
      suspense: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  const product = data?.product as FormattedProduct | undefined
  const sellerProfile = data?.seller

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!product) return 0
    return product.price * quantity
  }, [product, quantity])

  // Handle quantity changes
  const incrementQuantity = useCallback(() => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(q => q + 1)
    }
  }, [product, quantity])

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }, [quantity])

  const handleBuy = useCallback(() => {
    setOrderPlaced(true)
  }, [])

  // Handle errors
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Failed to load product</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => router.push("/marketplace")}>
          Return to Marketplace
        </Button>
      </div>
    )
  }

  // Loading state
  if (isLoading || !product) {
    return <ProductDetailSkeleton />
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <ErrorBoundary fallback={<div>Something went wrong loading this product. Please try again later.</div>}>
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
                  priority // Load first image with priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {product.isOrganic && (
                  <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">Organic</Badge>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.imageUrls.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      loading="lazy" // Lazy load thumbnails
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
                <span className="text-muted-foreground">{product.location || "Unknown location"}</span>
              </div>

              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">${totalPrice.toFixed(2)}</p>
                <p className="text-muted-foreground">
                  for {quantity} {product.unit} ({product.price.toFixed(2)} per {product.unit})
                </p>
                <Badge
                  variant={product.isAvailable && product.stockQuantity > 0 ? "default" : "secondary"}
                  className={
                    product.isAvailable && product.stockQuantity > 0
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }
                >
                  {product.isAvailable && product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
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
                    <StarRatingDisplay rating={Number(sellerProfile.rating) / 10} size="sm" showValue={true} />
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
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </Button>
                </div>

                {role === "buyer" && product.isAvailable && product.stockQuantity > 0 ? (
                  <>
                    <Button className="flex-1 gap-2" onClick={handleBuy} disabled={orderPlaced}>
                      <ShoppingCart className="h-4 w-4" />
                      {orderPlaced ? "Order Placed" : "Buy Now"}
                    </Button>

                    <AddToCartButton
                      product={product}
                      quantity={quantity}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      variant="outline"
                    />
                  </>
                ) : (
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleBuy}
                    disabled={!product.isAvailable || product.stockQuantity <= 0 || orderPlaced || role !== "buyer"}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {role !== "buyer" ? "Switch to Buyer Account" : orderPlaced ? "Order Placed" : "Buy Now"}
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
                {orderPlaced && <TabsTrigger value="order">Order Status</TabsTrigger>}
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Product Details</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{product.category}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Organic:</span>
                            <span>{product.isOrganic ? "Yes" : "No"}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Available Quantity:</span>
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
                          Store at room temperature away from direct sunlight. Refrigerate after cutting for up to 3 days.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Suspense fallback={<div className="p-4 text-center">Loading reviews...</div>}>
                  <ProductReviews productId={product.id} />
                </Suspense>
              </TabsContent>

              <TabsContent value="farmer" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    {sellerProfile ? (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image src="/placeholder.svg" alt={sellerProfile.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h3 className="font-medium">{sellerProfile.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <span>⭐</span>
                              <span>{Number(sellerProfile.rating) / 10} Rating</span>
                            </div>
                          </div>
                        </div>
                        <p className="mb-6">{sellerProfile.bio}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                            <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Farm Details</h4>
                            <p className="text-sm">{sellerProfile.farmDescription}</p>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Location</h4>
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
                            <p className="text-sm text-muted-foreground">Placed on {new Date().toLocaleDateString()}</p>
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
                            <span>${(product.price * quantity + 5).toFixed(2)}</span>
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
      </ErrorBoundary>
    </ProtectedRoute>
  )
}