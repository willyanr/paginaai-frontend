import { useProductsContext } from "@/context/ProductContext"
import { Card } from "../ui/card/Card"
import ProductForm from "./FormProduct"
import { useEffect } from "react";
import ProductList from "./ProductList ";



export const ProductsManage = () => {
  const {refresh } = useProductsContext();

    useEffect(() => {
      refresh()
    }, []);
  
    
    return(
        <div>
          <div className="flex gap-5">
            <div className="h-100 w-1/2">
              <Card>
                <div>
                 <ProductForm />
                </div>
              </Card>
            </div>
            <div className="">
              <ProductList/>
            </div>

          </div>
        </div>
    )




}