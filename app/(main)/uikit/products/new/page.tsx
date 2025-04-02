'use client';

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { createProduct } from "@/demo/service/api";
import { Product } from "@/demo/service/api";

const ProductCreatePage = () => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0
    }
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newProduct = await createProduct(formData);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Product created successfully',
        life: 3000
      });
      // Redirect to the new product's detail page
      router.push(`/products/${newProduct.id}`);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create product',
        life: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="mb-4">
        <Button
          onClick={() => router.back()}
          className="p-button-outlined"
          icon="pi pi-arrow-left"
          label="Back"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="field mb-4">
          <label htmlFor="title" className="block text-900 font-medium mb-2">
            Title
          </label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="price" className="block text-900 font-medium mb-2">
            Price
          </label>
          <InputNumber
            id="price"
            value={formData.price}
            onValueChange={(e) => handleChange('price', e.value)}
            mode="currency"
            currency="USD"
            required
            className="w-full"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="description" className="block text-900 font-medium mb-2">
            Description
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={5}
            required
            className="w-full"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="category" className="block text-900 font-medium mb-2">
            Category
          </label>
          <InputText
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="image" className="block text-900 font-medium mb-2">
            Image URL
          </label>
          <InputText
            id="image"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            required
            className="w-full"
          />
          {formData.image && (
            <div className="mt-3 border-round overflow-hidden" style={{ width: '150px' }}>
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full" 
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => router.back()}
          />
          <Button 
            type="submit" 
            label={isSubmitting ? 'Creating...' : 'Create Product'}
            icon="pi pi-check"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;