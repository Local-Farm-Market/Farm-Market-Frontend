"use client";

import { useState } from "react";
import { AddProductModal } from "@/src/components/product/add-product-modal";
import { ViewProductModal } from "@/src/components/product/view-product-modal";
import { EditProductModal } from "@/src/components/product/edit-product-modal";
import { DeleteProductModal } from "@/src/components/product/delete-product-modal";

// Mock product data that can be shared across components
export const mockProducts = [
  {
    id: "1",
    title: "Fresh Organic Tomatoes",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 45,
    sold: 120,
    status: "active",
    category: "Vegetables",
    dateAdded: "2023-05-10",
    description:
      "Delicious, vine-ripened organic tomatoes grown without pesticides or chemical fertilizers.",
    organic: true,
    location: "Green Valley Farm, California",
    unit: "lb",
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: "2",
    title: "Grass-Fed Beef",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 20,
    sold: 35,
    status: "active",
    category: "Meat",
    dateAdded: "2023-05-12",
    description:
      "Premium grass-fed beef raised on open pastures without hormones or antibiotics.",
    organic: false,
    location: "Sunset Ranch, Texas",
    unit: "lb",
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: "3",
    title: "Organic Free-Range Eggs",
    price: 5.49,
    image: "/placeholder.svg?height=200&width=200",
    stock: 0,
    sold: 80,
    status: "out_of_stock",
    category: "Poultry",
    dateAdded: "2023-05-15",
    description: "Farm-fresh organic eggs from free-range chickens.",
    organic: true,
    location: "Happy Hen Farm, Oregon",
    unit: "dozen",
    rating: 4.5,
    reviewCount: 32,
  },
  {
    id: "4",
    title: "Fresh Strawberries",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 15,
    sold: 65,
    status: "active",
    category: "Fruits",
    dateAdded: "2023-05-18",
    description: "Sweet, juicy strawberries picked at the peak of ripeness.",
    organic: false,
    location: "Berry Fields, Washington",
    unit: "lb",
    rating: 4.2,
    reviewCount: 19,
  },
  {
    id: "5",
    title: "Artisanal Goat Cheese",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 12,
    sold: 28,
    status: "active",
    category: "Dairy",
    dateAdded: "2023-05-20",
    description: "Creamy, tangy goat cheese made in small batches.",
    organic: false,
    location: "Mountain Dairy, Vermont",
    unit: "oz",
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "6",
    title: "Organic Quinoa",
    price: 6.99,
    image: "/placeholder.svg?height=200&width=200",
    stock: 30,
    sold: 42,
    status: "active",
    category: "Grains",
    dateAdded: "2023-05-22",
    description:
      "Nutrient-rich organic quinoa grown using sustainable farming practices.",
    organic: true,
    location: "Golden Fields, Idaho",
    unit: "lb",
    rating: 4.6,
    reviewCount: 11,
  },
];

// Define the Product type based on the mockProducts structure
export type Product = (typeof mockProducts)[0];

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);

  // Modal states
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [viewProductModalOpen, setViewProductModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handler functions for modals
  const handleAddProduct = (newProduct: Product) => {
    // In a real app, this would make an API call
    // For now, we'll just update the local state
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    return newProduct;
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    // Ensure all required properties are present
    const completeProduct = {
      ...product,
      description: product.description || "",
      organic: product.organic || false,
      location: product.location || "",
      unit: product.unit || "",
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
    };
    setSelectedProduct(completeProduct);
    setEditProductModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    // In a real app, this would make an API call
    // For now, we'll just update the local state
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    return updatedProduct;
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would make an API call
    // For now, we'll just update the local state
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setDeleteProductModalOpen(true);
  };

  // Filter products based on search query
  const filterProducts = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  // Render the modals
  const renderModals = () => {
    return (
      <>
        <AddProductModal
          open={addProductModalOpen}
          onOpenChange={setAddProductModalOpen}
          onAddProduct={handleAddProduct}
        />

        {selectedProduct && (
          <>
            <ViewProductModal
              open={viewProductModalOpen}
              onOpenChange={setViewProductModalOpen}
              product={selectedProduct}
              onEdit={(product) => handleEditProduct({ ...product, rating: product.rating || 0, reviewCount: product.reviewCount || 0 })}
              onDelete={(productId) => {
                const productToDelete = products.find(
                  (product) => product.id === productId
                );
                if (productToDelete) {
                  openDeleteModal(productToDelete);
                }
              }}
            />

            <EditProductModal
              open={editProductModalOpen}
              onOpenChange={setEditProductModalOpen}
              product={selectedProduct}
              onSave={(updatedProduct) =>
                handleSaveProduct({
                  ...updatedProduct,
                  rating: updatedProduct.rating || 0,
                  reviewCount: updatedProduct.reviewCount || 0,
                })
              }
            />

            <DeleteProductModal
              open={deleteProductModalOpen}
              onOpenChange={setDeleteProductModalOpen}
              productId={selectedProduct.id}
              productName={selectedProduct.title}
              onDelete={handleDeleteProduct}
            />
          </>
        )}
      </>
    );
  };

  return {
    products,
    filteredProducts,
    setFilteredProducts,
    addProductModalOpen,
    setAddProductModalOpen,
    viewProductModalOpen,
    setViewProductModalOpen,
    editProductModalOpen,
    setEditProductModalOpen,
    deleteProductModalOpen,
    setDeleteProductModalOpen,
    selectedProduct,
    setSelectedProduct,
    handleAddProduct,
    handleViewProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct,
    openDeleteModal,
    filterProducts,
    renderModals,
  };
}
