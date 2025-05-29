"use client";
import React from "react";
import CardPixel from "@/components/marketing/CardPixel";
import { MarketingProvider } from "@/context/MarketingContext";





export default function Marketing() {



  return (
    <MarketingProvider>
        <div className="">
          <CardPixel />
        </div>
    </MarketingProvider>
  );
}
