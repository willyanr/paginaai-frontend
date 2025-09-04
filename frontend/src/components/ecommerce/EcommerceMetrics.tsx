"use client";
import React from "react";
import { DataWalletWithTransactions } from "@/interfaces/checkout.interface";
import { BadgeDollarSign, BadgePercent } from "lucide-react";
import { Card } from "../ui/card/Card";
import { useNumberFormat } from "@/hooks/useNumberFormat";



interface Props {
  wallet: DataWalletWithTransactions
}


export const EcommerceMetrics: React.FC<Props> = ({ wallet }) => {

  const { formatNumber } = useNumberFormat();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">


      
      <Card>
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BadgeDollarSign className="size-10 text-brand-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Saldo Total
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            R$ {formatNumber(wallet?.balance)}
            </h4>
          </div>
        
        </div>
      </Card>

      <Card >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BadgePercent className="text-brand-500 size-10" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total de Vendas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              R$ {formatNumber(wallet?.total_orders_amount)}
            </h4>
          </div>
          
        </div>
      </Card>
    </div>
  );
};
