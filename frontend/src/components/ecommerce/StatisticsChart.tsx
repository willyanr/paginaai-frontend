"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import ChartTab from "../common/ChartTab";
import { ApexOptions } from "apexcharts";
import { useSession } from "next-auth/react";

function getWeekNumber(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Usando no useState


// Import dinâmico do ApexChart (sem SSR)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<"week" | "month" | "year">("week");
  const [data, setData] = useState({ labels: [], totals: [] });
  const [week] = useState<number>(getWeekNumber(new Date()));
  const [month] = useState<number>(new Date().getMonth() + 1);
  const [year] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    // só faz a requisição se o usuário estiver autenticado e tiver token
    if (!session?.accessToken) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.paginaai.com.br/api/checkout/user-orders-aggregated/?filter=${filter}&week=${week}&month=${month}&year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            withCredentials: true,
          }
        );

        setData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, [session?.accessToken, filter, week, month, year]);


const options: ApexOptions = {
  legend: {
    show: false,
    position: "top", 
    horizontalAlign: "left",
  },
  colors: ["#FFD053", "#ffdc9cff"],
  chart: {
    fontFamily: "Montserrant, sans-serif",
    height: 310,
    toolbar: { show: false },
  },
  stroke: {
    curve: "straight",
    width: [2, 2],
  },
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.55, opacityTo: 0 },
  },
  markers: {
    size: 0,
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: { size: 6 },
  },
  grid: {
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  dataLabels: { enabled: false },
  tooltip: { enabled: true, x: { format: "dd MMM yyyy" } },
  xaxis: {
    type: "category",
    categories: data.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `R$ ${val.toFixed(2)}`,
      style: { fontSize: "12px", colors: ["#6B7280"] },
    },
    title: { text: "", style: { fontSize: "0px" } },
  },
};
  const series = [
    {
      name: "Vendas Aprovadas",
      data: data.totals,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 w-full">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Suas vendas</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Acompanhe as métricas das suas vendas
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab onChangeFilter={(f) => setFilter(f)} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
