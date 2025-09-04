import { useProductsContext } from "@/context/ProductContext"
import { Card } from "../ui/card/Card"
import ProductForm from "./FormProduct"
import { useEffect } from "react";
import ProductList from "./ProductList ";



export const ProductsManage = () => {
  const {refresh } = useProductsContext();

    useEffect(() => {
      refresh()
    }, [refresh]);
  
    
    return(
        <div className="">
          <div className="lg:flex gap-5">
            <div className="lg:h-95 lg:w-1/2 mb-10">
              <Card>
                <div>
                 <ProductForm />
                </div>
              </Card>
            </div>
            <div className="h-180 overflow-y-auto lg:w-1/2 py-5 lg:py-0">
              <ProductList/>
            </div>

          </div>
        </div>
    )




}