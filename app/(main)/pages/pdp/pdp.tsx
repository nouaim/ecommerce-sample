import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../../../demo/service/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
  });

  return (
    <div>
      <button   onClick={() => navigate(-1)}>Back</button>
      {isLoading && <p>Loading...</p>}
      {product && <div>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>{product.description}</p>
        <p>{product.price}</p>
      </div>}
    </div>
  );
};

export default ProductDetail;
