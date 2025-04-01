'use client'; // Required since these are client-side hooks

import React from "react";
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from "../../../../demo/service/api";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

const ProductDetail = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', params.id],
    queryFn: () => getProduct(params.id),
  });

  if (error) {
    return <div>Error loading product</div>;
  }

  return (
    <div>
      <button onClick={() => router.back()}>Back</button>
      {isLoading && <p>Loading...</p>}
      {product && (
        <div>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;