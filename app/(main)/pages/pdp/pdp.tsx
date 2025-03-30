import React from "react";
import { useParams , useRouter} from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/api";


const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
  });

  return (
    
    <div>
      <button onClick={() => navigate.back()}>Back</button>
      {isLoading && <p>Loading...</p>}
      {product && <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>{product.price}</p>
      </div>}
    </div>
  );
};

export default ProductDetail;
