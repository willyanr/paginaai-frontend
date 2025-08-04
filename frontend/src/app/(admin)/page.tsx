"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { StatisticsProvider, useStatistics } from "@/context/StatisticsContext";


// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Ecommerce() {

  const { fetchStatistics, statistics } = useStatistics();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  let dataStatistics = null;

  if (statistics) {
     dataStatistics = statistics;
  }

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
