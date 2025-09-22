"use client";
import { useNumberFormat } from "@/hooks/useNumberFormat";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Card } from "../ui/card/Card";

interface MonthlyTargetProps {
  totalOrder: number;
  goal?: number;
}

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget({
  totalOrder,
  goal = 100000, // meta padrão: 100k
}: MonthlyTargetProps) {
  const { formatNumber } = useNumberFormat();

  // calcula progresso
  const percentage = Math.min((totalOrder / goal) * 100, 100);

  // para donut, passamos duas séries: progresso e restante
  const series = [percentage, 100 - percentage];

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#EF983B", "#faecd2ff"], // laranja progresso + cinza fundo
    labels: ["Atingido", "Restante"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => "R$ " + formatNumber(totalOrder),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <Card>
        <div className="px-2 pt-5 shadow-default rounded-2xl pb-11 sm:px-2 sm:pt-6">
          <div className="flex justify-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
                Total de Vendas
              </h3>
              <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Quantidade de vendas até agora.
              </p>
              <p className="text-brand-500 mt-1 text-center text-lg font-bold">
                Meta: R$ {formatNumber(goal)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="max-h-[330px] py-3">
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={260}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
