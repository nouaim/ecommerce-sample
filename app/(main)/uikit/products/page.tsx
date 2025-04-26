"use client";

import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { PickList } from "primereact/picklist";
import { OrderList } from "primereact/orderlist";
import { InputText } from "primereact/inputtext";
import { getProducts, getCategories, Product } from "@/demo/service/api";
import { useRouter } from "next/navigation";
import { Image } from "primereact/image";
import { Skeleton } from "primereact/skeleton";
import { canPerformAction } from "@/demo/service/auth";


const ListDemo = () => {
  const router = useRouter();
  const listValue = [
    { name: "San Francisco", code: "SF" },
    { name: "London", code: "LDN" },
    { name: "Paris", code: "PRS" },
    { name: "Istanbul", code: "IST" },
    { name: "Berlin", code: "BRL" },
    { name: "Barcelona", code: "BRC" },
    { name: "Rome", code: "RM" },
  ];

  const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
  const [picklistTargetValue, setPicklistTargetValue] = useState([]);
  const [orderlistValue, setOrderlistValue] = useState(listValue);
  const [dataViewValue, setDataViewValue] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Product[] | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
  const [sortField, setSortField] = useState("");
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setDataViewValue(products);
        setCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setFilteredValue(null);
    } else {
      const filtered = getFilteredProducts()?.filter((product) => {
        const productNameLowercase = product.title.toLowerCase();
        const searchValueLowercase = value.toLowerCase();
        return productNameLowercase.includes(searchValueLowercase);
      });
      setFilteredValue(filtered || null);
    }
  };

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;
    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const getFilteredProducts = () => {
    if (selectedCategory) {
      return dataViewValue.filter(
        (product) => product.category === selectedCategory
      );
    }
    return dataViewValue;
  };

  const CategoryFilter = () => (
    <div className="mb-4">
      <div className="flex justify-content-between align-items-center">
        <h1 className="text-3xl font-bold mb-4">
          {selectedCategory
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
            : "All Products"}
        </h1>
        {canPerformAction("create") && (
        <Button 
          icon="pi pi-plus" 
          label="Add Product" 
          className="p-button-success"
          onClick={() => router.push('/uikit/products/new')} // Adjust route as needed
        />
      )}
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2">
        <Button
          onClick={() => setSelectedCategory(null)}
          label="All"
          className={`whitespace-nowrap ${!selectedCategory ? "" : "p-button-outlined"}`}
        />
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} width="6rem" height="2.5rem" />
            ))
          : categories?.map((category: string) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                className={`whitespace-nowrap ${
                  selectedCategory === category ? "" : "p-button-outlined"
                }`}
              />
            ))}
      </div>
    </div>
  );


  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Sort By Price"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Search by Name"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e: any) => setLayout(e.value)}
      />
    </div>
  );

  const dataviewListItem = (product: Product) => {
    return (
      <div
        className="col-12 cursor-pointer"
        onClick={() => router.push(`/uikit/products/${product.id}`)}
      >
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full hover:surface-100 transition-colors transition-duration-300 border-round">
          <img
            src={product.image}
            alt={product.title}
            className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
            style={{ height: "200px", objectFit: "contain" }}
          />
          <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
            <div className="font-bold text-2xl mb-2">{product.title}</div>
            <Rating
              value={product.rating.rate}
              readOnly
              cancel={false}
              className="mb-2"
            />
            <div className="flex align-items-center mb-3">
              <i className="pi pi-tag mr-2"></i>
              <span className="font-semibold">{product.category}</span>
            </div>
          </div>
          <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
            <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
              ${product.price}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
              size="small"
              className="mb-2"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  };

  const dataviewGridItem = (product: Product) => {
    return (
      <div
        className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 cursor-pointer"
        onClick={() => router.push(`/uikit/products/${product.id}`)}
      >
        <div className="p-4 border-1 surface-border border-round hover:shadow-2 transition-all transition-duration-300 h-full flex flex-column">
          <div className="flex justify-content-between align-items-center mb-2">
            <div className="flex align-items-center">
              <i className="pi pi-tag mr-2 text-sm" />
              <span className="font-semibold text-sm">{product.category}</span>
            </div>
          </div>
          <div className="flex flex-column align-items-center text-center mb-3 flex-grow-1">
            <Image
              src={product.image}
              alt={product.title}
              width="200"
              height="200"
              className="mb-3"
              imageClassName="w-full h-10rem object-contain"
            />
            <div className="text-xl font-bold mb-2 line-clamp-2">
              {product.title}
            </div>
            <Rating
              value={product.rating.rate}
              readOnly
              cancel={false}
              className="mb-3"
            />
          </div>
          <div className="flex align-items-center justify-content-between mt-auto">
            <span className="text-xl font-semibold">${product.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product: Product) => {
    if (!product) return null;
    return layout === "list"
      ? dataviewListItem(product)
      : dataviewGridItem(product);
  };

  const displayProducts = filteredValue || getFilteredProducts();

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <CategoryFilter />
          <DataView
            value={displayProducts}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
            loading={loading}
          />
        </div>
      </div>


     
    </div>
  );
};

export default ListDemo;
