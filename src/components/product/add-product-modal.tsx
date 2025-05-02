"use client";

import type React from "react";

import { useState } from "react";
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
import { Camera, Upload, Plus, Leaf } from "lucide-react";

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
  rating: number;
  reviewCount: number;
}

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Product) => void;
}

export function AddProductModal({
  open,
  onOpenChange,
  onAddProduct,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
    images: [] as string[],
    organic: false,
    location: "Green Valley, California",
    image: "/placeholder.svg?height=200&width=200",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (
      !formData.title ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    )
      return;

    setIsSubmitting(true);

    try {
      // Generate a unique ID
      const id = Math.random().toString(36).substring(2, 9);

      // Create new product
      const newProduct: Product = {
        id,
        title: formData.title,
        price:
          typeof formData.price === "string"
            ? Number.parseFloat(formData.price)
            : formData.price,
        image: formData.image || "/placeholder.svg?height=200&width=200",
        stock:
          typeof formData.stock === "string"
            ? Number.parseInt(formData.stock)
            : formData.stock,
        sold: 0,
        status: Number(formData.stock) > 0 ? "active" : "out_of_stock",
        category: formData.category,
        dateAdded: new Date().toISOString().split("T")[0],
        description: formData.description || "",
        organic: formData.organic || false,
        location: formData.location || "",
        unit: formData.unit || "",
        rating: 0,
        reviewCount: 0,
      };

      // Call the onAddProduct callback
      onAddProduct(newProduct);

      // Reset form and close modal
      setFormData({
        title: "",
        category: "",
        price: "",
        stock: "",
        image: "/placeholder.svg?height=200&width=200",
        description: "",
        organic: false,
        location: "",
        unit: "",
        images: [],
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding product:", error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Plus className="h-5 w-5 text-amber-600" />
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter product name"
                value={formData.title}
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
                value={formData.price}
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
                value={formData.stock}
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
                value={formData.unit}
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
              value={formData.description}
              onChange={handleInputChange}
              className="border-amber-200 dark:border-amber-800 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <Camera className="h-10 w-10 text-amber-500 mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here or click to browse
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-amber-200 dark:border-amber-800"
                >
                  <Upload className="h-4 w-4" />
                  Upload Images
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="organic"
              checked={formData.organic}
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
              !formData.stock ||
              !formData.unit
            }
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
