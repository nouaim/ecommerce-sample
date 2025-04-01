'use client';

import React from "react";
import { useParams, useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { getProduct } from "../../../../../demo/service/api";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  }
}

const queryClient = new QueryClient();

const ProductDetailContent = () => {
  const params = useParams();
  const router = useRouter();

  console.log('Params:', params);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', params?.id],
    queryFn: () => getProduct(Number(params?.id)),
  });

  console.log('Product:', product);

  if (!params?.id) {
    return <div>Invalid product ID</div>;
  }

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Failed to load product. Please try again later.</div>;
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => router.back()}
        className="p-button p-component p-button-outlined mb-4"
      >
        <span className="pi pi-arrow-left mr-2"></span>
        Back
      </button>
  
      {product && (
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-4">
            <div className="border-1 surface-border border-round overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full p-4" 
                style={{ height: '300px', objectFit: 'contain' }}
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
                  <span>{product.rating.rate} ({product.rating.count} reviews)</span>
                </div>
              </div>
  
              <p className="text-2xl font-bold text-primary mb-4">${product.price}</p>
              
              <p className="line-height-3 mb-5">{product.description}</p>
  
              <button className="p-button p-component mr-3">
                <span className="pi pi-shopping-cart mr-2"></span>
                Add to Cart
              </button>
              <button className="p-button p-component p-button-outlined">
                <span className="pi pi-heart mr-2"></span>
                Add to Wishlist
              </button>
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