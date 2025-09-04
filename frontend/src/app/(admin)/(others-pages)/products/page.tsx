"use client";
import { ProductsManage } from "@/components/products/ProductsManage";
import { InfoPage } from "@/components/ui/info/InfoPage";
import React from "react";



export default function Products() {



  return (
    <div className="max-w-7xl mx-auto">
      <div className="">
        <InfoPage
          title="Produtos"
          subtitle="Gerencie seus produtos e realize suas primeiras vendas."
        />
      </div>
      <div className="py-5">
        <ProductsManage />
      </div>
    </div>
  );
}
