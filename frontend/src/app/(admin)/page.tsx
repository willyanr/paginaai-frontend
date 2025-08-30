"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {  useStatistics } from "@/context/StatisticsContext";
import { useCheckoutContext } from "@/context/CheckoutContext";
import { BasicTableOne } from "@/components/tables/BasicTableOne";



export default function Ecommerce() {

  const { fetchStatistics } = useStatistics();
  const { refreshWallet, wallet  }  = useCheckoutContext();

  useEffect(() => {
    fetchStatistics();
    refreshWallet()
  }, [fetchStatistics, refreshWallet]);




  return (
    <ProtectedRoute>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics 
          wallet={wallet[0]}
          />
         <div className="min-h-[600px]">
           <BasicTableOne 
          wallet={wallet[0]}
          />
         </div>
        </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget 
        totalOrder={wallet[0]?.total_orders_amount || 0 }
        />
         <div className="col-span-12 xl:col-span-7 py-6">
        <RecentOrders />
      </div>
      </div>

     

      

     
    </div>
     
    </ProtectedRoute>
  );
}
