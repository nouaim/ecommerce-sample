"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { update, deleteP } from "@/demo/service/productManagement";
import { getProduct, Product } from "@/demo/service/api";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Swal from "sweetalert2";

const queryClient = new QueryClient();

const ProductForm = ({
  product,
  onSuccess,
  onCancel,
}: {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Product>(product);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.warn("cool", formData);
    e.preventDefault();
    try {
      await update(product.id, formData);
      Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
      });
      onSuccess();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update product",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="field">
          <label htmlFor="title" className="block text-900 font-medium mb-2">
            Title
          </label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="price" className="block text-900 font-medium mb-2">
            Price
          </label>
          <InputNumber
            id="price"
            value={formData.price}
            onValueChange={(e) => handleChange("price", e.value)}
            mode="currency"
            currency="USD"
            required
          />
        </div>

        <div className="field">
          <label
            htmlFor="description"
            className="block text-900 font-medium mb-2"
          >
            Description
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category" className="block text-900 font-medium mb-2">
            Category
          </label>
          <InputText
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="image" className="block text-900 font-medium mb-2">
            Image URL
          </label>
          <InputText
            id="image"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            required
          />
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={onCancel}
          />
          <Button type="submit" label="Save" icon="pi pi-check" />
        </div>
      </form>
    </div>
  );
};

const ProductDetailContent = () => {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef<Toast>(null);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", params?.id],
    queryFn: () => getProduct(Number(params?.id)),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Do you want to Delete?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (product) {
          try {
            const success = await deleteP(product.id);
            if (success) {
              toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Product deleted successfully",
                life: 3000,
              });
              Swal.fire("Deleted!", "", "success");

              router.push("/");
            }
          } catch (error) {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete product",
              life: 3000,
            });
          }
        }
      } else if (result.isDenied) {
        Swal.fire("Product was not deleted", "", "info");
      }
    });
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  if (!params?.id) {
    return <div>Invalid product ID</div>;
  }

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Failed to load product. Please try again later.</div>;
  }

  if (isEditing && product) {
    return (
      <ProductForm
        product={product}
        onSuccess={handleFormSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <Button
          onClick={() => router.back()}
          className="p-button-outlined"
          icon="pi pi-arrow-left"
          label="Back"
        />
        <div className="flex gap-2">
          <Button
            icon="pi pi-pencil"
            label="Edit"
            className="p-button-primary"
            onClick={handleEdit}
          />
          <Button
            icon="pi pi-trash"
            label="Delete"
            className="p-button-danger"
            onClick={handleDelete}
          />
        </div>
      </div>

      {product && (
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-4">
            <div className="border-1 surface-border border-round overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full p-4"
                style={{ height: "300px", objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-8">
            <div className="p-4">
              <h2 className="text-3xl font-bold mb-3">{product.title}</h2>

              <div className="flex align-items-center mb-4">
                <span className="bg-blue-500 text-white border-round px-3 py-1 text-sm">
                  {product.category}
                </span>
                <div className="ml-3 flex align-items-center">
                  <span className="pi pi-star-fill text-yellow-500 mr-1"></span>
                  <span>
                    {product.rating.rate} ({product.rating.count} reviews)
                  </span>
                </div>
              </div>

              <p className="text-2xl font-bold text-primary mb-4">
                ${product.price}
              </p>

              <p className="line-height-3 mb-5">{product.description}</p>

              <div className="flex gap-2">
                <Button
                  icon="pi pi-shopping-cart"
                  label="Add to Cart"
                  className="p-button-primary"
                />
                <Button
                  icon="pi pi-heart"
                  label="Add to Wishlist"
                  className="p-button-outlined"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductDetailContent />
    </QueryClientProvider>
  );
};

export default ProductDetail;
