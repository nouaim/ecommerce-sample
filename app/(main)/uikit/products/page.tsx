"use client";

import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { PickList } from "primereact/picklist";
import { OrderList } from "primereact/orderlist";
import { ProductService } from "../../../../demo/service/ProductService";
import { InputText } from "primereact/inputtext";
import type { Demo } from "@/types";
import { ProductServiceApi } from "@/demo/service/ProductServiceApi";
import { useRouter } from 'next/navigation'
import { Image } from "primereact/image";


// In your component

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  

const ListDemo = () => {
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
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Product[] | null>(
    null
  );
  const [layout, setLayout] = useState<
    "grid" | "list" | (string & Record<string, unknown>)
  >("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
  const [sortField, setSortField] = useState("");

  const sortOptions = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
  ];

  useEffect(() => {
    ProductServiceApi.getProductsSmall().then((data) => setDataViewValue(data));
    setGlobalFilterValue("");
  }, []);

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setFilteredValue(null);
    } else {
      const filtered = dataViewValue?.filter((product) => {
        const productNameLowercase = product.title.toLowerCase();
        const searchValueLowercase = value.toLowerCase();
        return productNameLowercase.includes(searchValueLowercase);
      });

      setFilteredValue(filtered);
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
        onChange={(e) => setLayout(e.value)}
      />
    </div>
  );

  const dataviewListItem = (product: any) => {
    const router = useRouter();
    return (
      <div className="col-12" onClick={() => router.push(`/uikit/products/${product.id}`)}>
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
          <img
            src={product.image}
            alt={product.title}
            className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
            loading="lazy" // Optional: enables native lazy loading
          />
          <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
            <div className="font-bold text-2xl">{product.title}</div>
            {/* <div className="mb-2">{product.description}</div> */}
            <Rating
              value={product.rating.rate}
              readOnly
              cancel={false}
              className="mb-2"
            ></Rating>
            <div className="flex align-items-center">
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
            ></Button>
            <span
              className={`product-badge status-${product.inventoryStatus?.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const dataviewGridItem = (product: any) => {
    const router = useRouter();

    return (
      <div className="col-12 lg:col-4"  onClick={() => router.push(`/uikit/products/${product.id}`)}>
        <div className="card m-3 border-1 surface-border">
          <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <div className="flex align-items-center">
              <i className="pi pi-tag mr-2" />
              <span className="font-semibold">{product.category}</span>
            </div>
            <span
              className={`product-badge status-${product.inventoryStatus?.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
          </div>
          <div className="flex flex-column align-items-center text-center mb-3">
            <Image src={product.image} alt="Image" width="200" height="200" />
            <div className="text-2xl font-bold">{product.title}</div>
            {/* <div className="mb-3">{product.description}</div> */}
            <Rating value={product.rating.rate} readOnly cancel={false} />
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${product.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (
    data: Demo.Product,
    layout: "grid" | "list" | (string & Record<string, unknown>)
  ) => {
    if (!data) {
      return;
    }

    if (layout === "list") {
      return dataviewListItem(data);
    } else if (layout === "grid") {
      return dataviewGridItem(data);
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>DataView</h5>
          <DataView
            value={filteredValue || dataViewValue}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          ></DataView>
        </div>
      </div>

      <div className="col-12 xl:col-8">
        <div className="card">
          <h5>PickList</h5>
          <PickList
            source={picklistSourceValue}
            target={picklistTargetValue}
            sourceHeader="From"
            targetHeader="To"
            itemTemplate={(item) => <div>{item.name}</div>}
            onChange={(e) => {
              setPicklistSourceValue(e.source);
              setPicklistTargetValue(e.target);
            }}
            sourceStyle={{ height: "200px" }}
            targetStyle={{ height: "200px" }}
          ></PickList>
        </div>
      </div>

      <div className="col-12 xl:col-4">
        <div className="card">
          <h5>OrderList</h5>
          <OrderList
            value={orderlistValue}
            listStyle={{ height: "200px" }}
            className="p-orderlist-responsive"
            header="Cities"
            itemTemplate={(item) => <div>{item.name}</div>}
            onChange={(e) => setOrderlistValue(e.value)}
          ></OrderList>
        </div>
      </div>
    </div>
  );
};

export default ListDemo;
