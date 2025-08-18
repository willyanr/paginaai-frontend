"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {  useStatistics } from "@/context/StatisticsContext";



export default function Ecommerce() {

  const { fetchStatistics } = useStatistics();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);



  return (
    <ProtectedRoute>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics 
        />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

     

      

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
     
    </ProtectedRoute>
  );
}
