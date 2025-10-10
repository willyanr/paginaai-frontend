"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import {  useStatistics } from "@/context/StatisticsContext";
import { useCheckoutContext } from "@/context/CheckoutContext";
import { BasicTableOne } from "@/components/tables/BasicTableOne";
import { CardRequestWithdraws } from "@/components/checkout/CardRequestWithdraws";



export default function Ecommerce() {

  const { fetchStatistics } = useStatistics();
  const { refreshWallet, wallet  }  = useCheckoutContext();
  useEffect(() => {
    fetchStatistics();
    refreshWallet()
  }, [fetchStatistics, refreshWallet]);




  return (

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
           <div className="py-5">
                 <CardRequestWithdraws
        withdraws={wallet[0]}
        />
        </div>
        <RecentOrders />
       
      </div>
      </div>

     

      

     
    </div>
     
   
  );
}
