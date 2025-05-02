"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Camera, Edit, Leaf } from "lucide-react";
import Image from "next/image";

// Update the Product interface to match the exact structure of mockProducts
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  sold: number;
  status: string;
  category: string;
  dateAdded: string;
  description: string;
  organic: boolean;
  location: string;
  unit: string;
  rating?: number;
  reviewCount?: number;
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  onSave,
}: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price,
        stock: product.stock,
      });
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!product || !formData) return;

    setIsSubmitting(true);

    try {
      // Create updated product
      const updatedProduct = {
        ...product,
        ...formData,
        price:
          typeof formData.price === "string"
            ? Number.parseFloat(formData.price)
            : formData.price || 0,
        stock:
          typeof formData.stock === "string"
            ? Number.parseInt(formData.stock)
            : formData.stock || 0,
        available:
          (typeof formData.stock === "string"
            ? Number.parseInt(formData.stock)
            : formData.stock || 0) > 0,
        status:
          (typeof formData.stock === "string"
            ? Number.parseInt(formData.stock)
            : formData.stock || 0) > 0
            ? "active"
            : "out_of_stock",
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
      };

      // Call the onSave callback
      onSave(updatedProduct as Product);

      // Close modal
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat",
    "Poultry",
    "Grains",
    "Organic",
  ];

  const units = ["lb", "kg", "oz", "g", "each", "bunch", "dozen"];

  if (!product || !formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Edit className="h-5 w-5 text-amber-600" />
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-md overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-200"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter product name"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="border-amber-200 dark:border-amber-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="border-amber-200 dark:border-amber-800">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="border-amber-200 dark:border-amber-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="0"
                value={formData.stock || ""}
                onChange={handleInputChange}
                className="border-amber-200 dark:border-amber-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.unit || ""}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger className="border-amber-200 dark:border-amber-800">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product"
              value={formData.description || ""}
              onChange={handleInputChange}
              className="border-amber-200 dark:border-amber-800 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="border-amber-200 dark:border-amber-800"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="organic"
              checked={formData.organic || false}
              onChange={(e) =>
                setFormData({ ...formData, organic: e.target.checked })
              }
              className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <Label htmlFor="organic" className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-green-600" />
              Certified Organic Product
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.title ||
              !formData.category ||
              !formData.price ||
              !formData.stock
            }
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
