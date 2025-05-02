import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js  Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js  Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Tables() {
  return (
    <div>
      <PageBreadcrumb pageTitle=" Table" />
      <div className="space-y-6">
        <ComponentCard title=" Table 1">
          <TableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
