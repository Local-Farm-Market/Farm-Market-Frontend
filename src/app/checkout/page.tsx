"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Separator } from "@/src/components/ui/separator";
import { useCart } from "@/src/hooks/use-cart";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { CreditCard, Truck, Check, ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import { useUserRole } from "@/src/hooks/use-user-role";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    tax,
    total,
    clearCart,
    createOrder,
    isLoading,
    isPending,
  } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useUserRole();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [shippingAddress, setShippingAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty or user is a seller
  useEffect(() => {
    if (mounted) {
      if (items.length === 0 && !isLoading) {
        router.push("/cart");
      }
      if (role === "seller") {
        router.push("/marketplace");
      }
    }
  }, [mounted, items.length, role, router, isLoading]);

  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  if (role === "seller" || items.length === 0) {
    return null; // Will redirect via useEffect
  }

  const handleCheckout = async () => {
    if (!firstName || !lastName || !city || !zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Format shipping address
      const formattedAddress = `${firstName} ${lastName}, ${shippingAddress}, ${city}, ${zipCode}`;

      // Create order from cart
      await createOrder(formattedAddress);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and is being processed.",
        variant: "default",
      });

      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true} requireRole="buyer">
      <div className="py-6">
        <DashboardHeader title="Checkout" />

        <Button
          variant="ghost"
          onClick={() => router.push("/cart")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <CreditCard className="h-6 w-6" />
              Checkout
            </h1>
            <Button variant="ghost" onClick={() => router.push("/cart")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="border-amber-100 dark:border-amber-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="mt-1"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="mt-1"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Farm Street"
                      className="mt-1"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Farmville"
                      className="mt-1"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="12345"
                      className="mt-1"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-amber-100 dark:border-amber-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 border-amber-200 dark:border-amber-800">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Cryptocurrency (ETH)</span>
                          <div className="flex gap-2">
                            <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      You'll pay with ETH directly from your connected wallet.
                      The total amount includes product price, tax, and
                      shipping.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Order Summary */}
              <Card className="border-amber-100 dark:border-amber-900/50 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Item list */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              item.product?.imageUrls[0] || "/placeholder.svg"
                            }
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            $
                            {(
                              (item.product?.price || 0) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$5.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-green-700 dark:text-green-400">
                        ${(total + 5).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>Estimated delivery: 3-5 business days</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCheckout}
                    disabled={isProcessing || isPending}
                  >
                    {isProcessing || isPending ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Place Order (${(total + 5).toFixed(2)})
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
