"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { useUserRole } from "@/src/hooks/use-user-role";
import { WalletConnect } from "@/src/components/auth/wallet-connect";
import { NotificationPanel } from "@/src/components/notifications/notification-panel";
import { ThemeToggle } from "@/src/components/layout/theme-toggle";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { ReviewsModal } from "@/src/components/seller/reviews-modal";
import {
  User,
  Settings,
  Bell,
  Shield,
  Camera,
  Star,
  Calendar,
  Leaf,
  Heart,
  ShoppingBag,
  Truck,
  CreditCard,
  Sprout,
  Store,
  BarChart,
  Wallet,
  Plus,
  ArrowUpRight,
  Package,
  CheckCircle,
  MapPin,
  Mail,
} from "lucide-react";

// Mock buyer user data
const mockBuyerUser = {
  name: "John Smith",
  email: "john.smith@example.com",
  avatar: "/placeholder.svg?height=200&width=200",
  bio: "I'm passionate about supporting local farmers and eating organic, sustainable food. Always looking for the freshest produce for my family.",
  location: "Green Valley, California",
  memberSince: "January 2022",
  favoriteCategories: ["Organic", "Vegetables", "Fruits"],
  purchaseHistory: {
    totalOrders: 24,
    totalSpent: 1245.5,
    favoriteProducts: [
      {
        id: "1",
        title: "Fresh Organic Tomatoes",
        price: 3.99,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        title: "Grass-Fed Beef",
        price: 12.99,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  walletAddress: "lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4",
};

// Mock seller user data
const mockSellerUser = {
  name: "John Smith",
  email: "john.smith@example.com",
  avatar: "/placeholder.svg?height=200&width=200",
  bio: "Organic farmer with 15 years of experience. Specializing in sustainable farming practices and high-quality produce.",
  location: "Green Valley, California",
  memberSince: "January 2022",
  rating: 4.8,
  reviewCount: 24,
  isSeller: true,
  farmDetails: {
    name: "Green Valley Farm",
    description:
      "Family-owned organic farm specializing in heirloom vegetables and free-range eggs.",
    certifications: [
      "Certified Organic",
      "Sustainable Farming",
      "Animal Welfare Approved",
    ],
    farmSize: "25 acres",
  },
  products: [
    {
      id: "1",
      title: "Fresh Organic Tomatoes",
      price: 3.99,
      image: "/placeholder.svg?height=200&width=200",
      available: true,
    },
    {
      id: "2",
      title: "Grass-Fed Beef",
      price: 12.99,
      image: "/placeholder.svg?height=200&width=200",
      available: true,
    },
    {
      id: "3",
      title: "Organic Free-Range Eggs",
      price: 5.49,
      image: "/placeholder.svg?height=200&width=200",
      available: false,
    },
  ],
  walletAddress: "lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4",
};

export default function ProfilePage() {
  const { role, setRole } = useUserRole();
  const [user, setUser] = useState(() => {
    // Try to load profile data from localStorage
    const savedProfile =
      typeof window !== "undefined"
        ? localStorage.getItem("userProfile")
        : null;
    const profileData = savedProfile ? JSON.parse(savedProfile) : {};

    // Filter out empty values
    const cleanedProfileData = Object.entries(profileData || {}).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    // Merge profile data with role-specific mock data for required fields only
    return {
      ...(role === "seller" ? mockSellerUser : mockBuyerUser),
      ...cleanedProfileData,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    location: user.location || "",
    // For sellers
    farmName:
      user.farmName ||
      (role === "seller" && user.farmDetails ? user.farmDetails.name : ""),
    farmDescription:
      user.farmDescription ||
      (role === "seller" && user.farmDetails
        ? user.farmDetails.description
        : ""),
    farmSize:
      user.farmSize ||
      (role === "seller" && user.farmDetails ? user.farmDetails.farmSize : ""),
    organicCertified: user.organicCertified || false,
    // For buyers
    preferredCategories: user.preferredCategories || [],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    paymentNotifications: true,
    newMessages: true,
    marketplaceUpdates: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = () => {
    // Filter out empty values
    const cleanedFormData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    // Create updated user object
    const updatedUser = {
      ...user,
      ...cleanedFormData,
      // Update nested properties for display if they exist
      farmDetails:
        role === "seller"
          ? {
              ...user.farmDetails,
              ...(cleanedFormData.farmName
                ? { name: cleanedFormData.farmName }
                : {}),
              ...(cleanedFormData.farmDescription
                ? { description: cleanedFormData.farmDescription }
                : {}),
              ...(cleanedFormData.farmSize
                ? { farmSize: cleanedFormData.farmSize }
                : {}),
            }
          : user.farmDetails,
    };

    // Update state
    setUser(updatedUser);

    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(cleanedFormData));

    // Exit edit mode
    setIsEditing(false);
  };

  const handleToggleNotification = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = formData.preferredCategories || [];
    let updatedCategories = [...currentCategories];

    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((c) => c !== category);
    } else {
      updatedCategories.push(category);
    }

    setFormData({ ...formData, preferredCategories: updatedCategories });
  };

  // Update the BuyerProfile component to conditionally render fields
  const BuyerProfile = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-amber-100 dark:border-amber-900/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-200"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {user.name && (
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                  {user.name}
                </h2>
              )}
              <p className="text-muted-foreground font-mono text-xs truncate max-w-[200px]">
                {user.walletAddress ||
                  "lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4"}
              </p>

              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Member since {user.memberSince}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>

              {user.preferredCategories &&
                user.preferredCategories.length > 0 && (
                  <div className="w-full mt-6">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-amber-600" />
                      Favorite Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.preferredCategories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-amber-100 dark:border-amber-900/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
                <User className="h-5 w-5 mr-2 text-amber-600" />
                About Me
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                {user.bio ? (
                  <p>{user.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No bio information provided yet.
                  </p>
                )}
                {user.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Categories</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                      {[
                        "Vegetables",
                        "Fruits",
                        "Dairy",
                        "Meat",
                        "Poultry",
                        "Grains",
                        "Organic",
                      ].map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Switch
                            id={`category-${category}`}
                            checked={(
                              formData.preferredCategories || []
                            ).includes(category)}
                            onCheckedChange={() =>
                              handleCategoryToggle(category)
                            }
                          />
                          <Label htmlFor={`category-${category}`}>
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2 border-amber-100 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-amber-600" />
              Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <div className="text-sm text-green-800 dark:text-green-300">
                  Total Orders
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-200">
                  {mockBuyerUser.purchaseHistory.totalOrders}
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  Total Spent
                </div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                  ${mockBuyerUser.purchaseHistory.totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Active Orders
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  3
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Favorite Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBuyerUser.purchaseHistory.favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 border rounded-md border-amber-100 dark:border-amber-900/50"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.title}</h4>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                      >
                        Buy Again
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-amber-100 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Lisk Wallet</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Default
                  </Badge>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                <Plus className="h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Update the SellerProfile component to conditionally render fields
  const SellerProfile = () => {
    const [reviewsModalOpen, setReviewsModalOpen] = useState(false);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-amber-100 dark:border-amber-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-200"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {user.name && (
                  <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                    {user.name}
                  </h2>
                )}
                <p className="text-muted-foreground font-mono text-xs truncate max-w-[200px]">
                  {user.walletAddress ||
                    "lsk7h3kquly4s5cgh8bj2j9yqtbdgz4venhmgkx4"}
                </p>

                <div className="flex items-center mt-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{mockSellerUser.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({mockSellerUser.reviewCount} reviews)
                  </span>
                </div>

                <div className="w-full mt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Member since {user.memberSince}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                {(user.organicCertified ||
                  (user.farmDetails &&
                    user.farmDetails.certifications &&
                    user.farmDetails.certifications.length > 0)) && (
                  <div className="w-full mt-6">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Sprout className="h-4 w-4 mr-1 text-green-600" />
                      Farm Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(user.organicCertified ? ["Certified Organic"] : [])
                        .concat(
                          user.farmDetails && user.farmDetails.certifications
                            ? user.farmDetails.certifications.filter(
                                (cert) => cert !== "Certified Organic"
                              )
                            : []
                        )
                        .map((cert) => (
                          <Badge
                            key={cert}
                            variant="outline"
                            className="bg-green-50 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/50"
                          >
                            {cert}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-amber-100 dark:border-amber-900/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-amber-600" />
                  Farm Profile
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    {user.farmName ? (
                      <h3 className="font-medium text-lg text-amber-800 dark:text-amber-300">
                        {user.farmName}
                      </h3>
                    ) : (
                      <h3 className="font-medium text-lg text-amber-800/50 dark:text-amber-300/50 italic">
                        Farm Name Not Set
                      </h3>
                    )}
                    {user.bio ? (
                      <p className="mt-2">{user.bio}</p>
                    ) : (
                      <p className="mt-2 text-muted-foreground italic">
                        No bio information provided yet.
                      </p>
                    )}
                    {user.email && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  {(user.farmDescription || user.farmSize) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {user.farmDescription && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                            Farm Details
                          </h4>
                          <p className="text-sm">{user.farmDescription}</p>
                        </div>
                      )}
                      {user.farmSize && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                            Farm Size
                          </h4>
                          <p className="text-sm">{user.farmSize}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-amber-200 dark:border-amber-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-amber-200 dark:border-amber-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmDescription">Farm Description</Label>
                    <Textarea
                      id="farmDescription"
                      name="farmDescription"
                      rows={3}
                      value={formData.farmDescription}
                      onChange={handleInputChange}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="organicCertified"
                      checked={formData.organicCertified}
                      onCheckedChange={() =>
                        setFormData({
                          ...formData,
                          organicCertified: !formData.organicCertified,
                        })
                      }
                    />
                    <Label
                      htmlFor="organicCertified"
                      className="flex items-center gap-1"
                    >
                      <Leaf className="h-4 w-4 text-green-600" />
                      Certified Organic
                    </Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="md:col-span-2 border-amber-100 dark:border-amber-900/50">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-amber-600" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-300">
                    Total Sales
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-200">
                    $12,450
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +15% from last
                    month
                  </div>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    Total Products
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                    24
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    3 out of stock
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    Customer Reviews
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                    4.8
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    From 24 reviews
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
              <div className="space-y-4">
                {mockSellerUser.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 border rounded-md border-amber-100 dark:border-amber-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)} ·{" "}
                          {product.available ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 border-amber-100 dark:border-amber-900/50">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-600" />
                Customer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm">
                    "The tomatoes were incredibly fresh and flavorful. Will
                    definitely order again!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Sarah M.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      1 week ago
                    </span>
                  </div>
                  <p className="text-sm">
                    "Great quality beef, but delivery was a bit delayed."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Michael T.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setReviewsModalOpen(true)}
                >
                  View All Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Reviews Modal */}
        <ReviewsModal
          open={reviewsModalOpen}
          onOpenChange={setReviewsModalOpen}
        />
      </>
    );
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
            <Leaf className="h-6 w-6 mr-2 text-amber-600" />
            {role === "seller" ? "Seller Profile" : "My Profile"}
          </h1>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <ThemeToggle />
            <WalletConnect onRoleSelect={setRole} />
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-amber-100 dark:bg-amber-950/50">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            {role === "seller" ? (
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Products
              </TabsTrigger>
            ) : (
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Orders
              </TabsTrigger>
            )}
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {role === "seller" ? <SellerProfile /> : <BuyerProfile />}
          </TabsContent>

          <TabsContent value="products">
            {role === "seller" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                    My Products
                  </h2>
                  <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSellerUser.products.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden border-amber-100 dark:border-amber-900/50"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          variant={product.available ? "default" : "secondary"}
                          className={`absolute top-2 right-2 ${
                            product.available
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
                          }`}
                        >
                          {product.available ? "Available" : "Sold Out"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-lg font-bold mt-1 text-green-700 dark:text-green-400">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          >
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {role === "buyer" && (
              <div>
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-6">
                  My Orders
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        2
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Active Orders
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        18
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Completed Orders
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                        <Truck className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        1
                      </div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">
                        In Delivery
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mb-6 bg-amber-600 hover:bg-amber-700 text-white">
                  View All Orders
                </Button>

                <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md border-amber-100 dark:border-amber-900/50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-medium">Order #12345</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          May 15, 2023
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          Fresh Organic Tomatoes (x3)
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Green Valley Farm
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-700 dark:text-green-400">
                          $23.97
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                        >
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md border-amber-100 dark:border-amber-900/50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-medium">Order #12346</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          May 10, 2023
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Grass-Fed Beef (x1)</div>
                        <div className="text-sm text-muted-foreground">
                          Sunset Ranch
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-700 dark:text-green-400">
                          $12.99
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                        >
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="border-amber-100 dark:border-amber-900/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-800 dark:text-amber-300">
                      <User className="h-5 w-5 mr-2 text-amber-600" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile Information
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Preferences
                      </Button>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="border-amber-100 dark:border-amber-900/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-800 dark:text-amber-300">
                      <Bell className="h-5 w-5 mr-2 text-amber-600" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Order Updates</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your orders
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.orderUpdates}
                          onCheckedChange={() =>
                            handleToggleNotification("orderUpdates")
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Payment Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified about payments and escrow updates
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.paymentNotifications}
                          onCheckedChange={() =>
                            handleToggleNotification("paymentNotifications")
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">New Messages</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new messages
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.newMessages}
                          onCheckedChange={() =>
                            handleToggleNotification("newMessages")
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Marketplace Updates</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new products and promotions
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.marketplaceUpdates}
                          onCheckedChange={() =>
                            handleToggleNotification("marketplaceUpdates")
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
