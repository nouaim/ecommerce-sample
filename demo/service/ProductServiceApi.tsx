import { Demo } from "@/types";

export const ProductServiceApi = {
  getProductsSmall() {
    return fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => data as any);
  },
};
