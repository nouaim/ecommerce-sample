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
    <div>
      <button onClick={() => router.back()}>Back</button>
      {product && (
        <div>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <img src={product.image} alt={product.title} />
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