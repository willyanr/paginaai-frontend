import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { Card } from "../ui/card/Card";
import { DataWalletWithTransactions } from "@/interfaces/checkout.interface";
import { ShoppingCart } from "lucide-react";
import { useNumberFormat } from "@/hooks/useNumberFormat";
import { useDateFormatter } from "@/hooks/useDateFormatter";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

interface Props {
  wallet: DataWalletWithTransactions
}
// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];



export const BasicTableOne: React.FC<Props> = ({ wallet }) => {

  const { formatNumber } = useNumberFormat();
  const { formatDateTime } = useDateFormatter();

  if (!wallet) return <>CARREANDO</>

  console.log(wallet)
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] h-full">
      <div className="max-w-full overflow-x-auto">
        <div className="">
          <Card>
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Produto
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                   <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Data
                  </TableCell>
                 
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {wallet?.orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start w-28">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <ShoppingCart className="dark:text-gray-300" />
                          <div className="w-52">
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                              {item.product_name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              Quantidade: {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-28">
                      <Badge
                        size="sm"
                        color={
                          order.status === "paid"
                            ? "success"
                            : order.status === "pending"
                              ? "warning"
                              : "error"
                        }
                      >
                        { order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : ''}
                      </Badge>
                    </TableCell>
                   
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-300 font-bold">
                      {order.payment_method === 'pix' ? 'Pix' : order.payment_method === 'card' ? 'Cartão' : ''}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-300 font-bold">
                     R$ {formatNumber(order.amount)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-300 font-medium">
                     {formatDateTime(order.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
