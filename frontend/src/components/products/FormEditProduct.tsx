import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import React, { useState } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProductsContext } from "@/context/ProductContext";
import { DataProduct } from "@/interfaces/products.interface";
import FileInput from "../form/input/FileInput";
import { Save } from "lucide-react";
import { useAlertContext } from "@/context/AlertContext";
import Switch from "../form/switch/Switch";


interface FormEditProductProps {
  product: DataProduct;
  setEditingId: React.Dispatch<React.SetStateAction<boolean | number>>;
}

interface DataEditProductForm {
  product_type: "digital" | "physical";
  name?: string;
  description?: string;
  price?: number;
  download_url?: string;
  image?: string | File | FileList;
  stock?: number;
  weight?: number;
  dimensions?: string;
  is_active?: boolean;
  id?: number;
}



const FormEditProduct: React.FC<FormEditProductProps> = ({ product, setEditingId }) => {


  const { refresh, updateProducts } = useProductsContext();
  const { onAlert } = useAlertContext();




  const editProduct = async (data: DataEditProductForm) => {

    const formData = new FormData();
    if (data.image instanceof FileList) {
      formData.append("image", data.image[0]);
    } else if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    formData.append("product_type", productType);
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price?.toString() || "0");
    formData.append("download_url", data.download_url || "");

    formData.append("download_url", data.download_url || "");
    formData.append("stock", String(data.stock || 0));
    formData.append("weight", String(data.weight || 0));
    formData.append("dimensions", data.dimensions || "");
    formData.append("is_active", String(data.is_active));


    await updateProducts(formData, product!.id!);

    refresh();
    console.log(product)


  }




  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    product_type: yup.mixed<"digital" | "physical">()
      .oneOf(["digital", "physical"])
      .required("O tipo de produto é obrigatório"),
    name: yup
      .string()

      .matches(/^[^<>]*$/, "O nome não pode conter caracteres < ou >.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),

    description: yup.string(),
    is_active: yup.boolean(),
    price: yup.number().min(0, "Preço inválido"),
    download_url: yup.string(),
    stock: yup.number().min(0, "Estoque inválido"),
    weight: yup.number().min(0, "Peso inválido"),
    dimensions: yup.string(),
    image: yup
      .mixed<File>()
      .test("fileSize", "O arquivo é muito grande", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Formato de arquivo não suportado", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
      }),



  });
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product_type: product?.product_type ?? "digital",
      name: product.name,
      description: product.description,
      price: product.price,
      download_url: product.download_url,
      is_active: product.is_active,
    },
  });

  const [productType, setProductType] = useState<string>(product.product_type || "digital");




  const onSubmit = async (data: DataEditProductForm) => {
    setIsLoading(true);
    try {
      await editProduct(data)
      onAlert(true, 'success', 'Produto atualizado com sucesso.')

    } finally {
      setIsLoading(false);
      setEditingId(false);

    }
  };

  const setEd = () => {
    setEditingId(false);
  }


  return (
   <div>
  <form className="mx-auto rounded-lg md:p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
    {/* Tipo de Produto e Botões */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="mb-4 w-full md:w-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
          Tipo de Produto
        </label>

        <div className="relative w-full max-w-xs h-12 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex items-center p-1">
          {/* Indicador de seleção */}
          <div
            className="absolute top-1 left-1 w-1/2 h-10 bg-brand-500 rounded-full shadow-md transition-all duration-300 ease-in-out"
            style={{
              transform: productType === "physical" ? "translateX(100%)" : "translateX(0%)",
            }}
          />

          {/* Botões */}
          <button
            type="button"
            onClick={() => {
              setProductType("digital");
              setValue("product_type", "digital");
            }}
            className={`relative w-1/2 md:w-20 h-full z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
              productType === "digital"
                ? "text-white"
                : "text-gray-700 dark:text-white hover:text-gray-900"
            }`}
          >
            Digital
          </button>
          <button
            type="button"
            onClick={() => {
              setProductType("physical");
              setValue("product_type", "physical");
            }}
            className={`relative w-1/2 md:w-20 h-full z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
              productType === "physical"
                ? "text-white"
                : "text-gray-700 dark:text-white hover:text-gray-900"
            }`}
          >
            Físico
          </button>
        </div>

        {errors.product_type && (
          <p className="mt-1 text-xs text-red-500">{errors.product_type.message}</p>
        )}
      </div>

      {/* Botões Salvar/Cancelar */}
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
        <Button
          isLoading={isLoading}
          type="submit"
          className="w-full sm:w-auto"
          startIcon={<Save />}
        >
          Salvar
        </Button>
        <Button
          variant="outline"
          onClick={setEd}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
      </div>
    </div>

    {/* Campos do Formulário */}
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Coluna 1 */}
      <div className="flex-1 flex flex-col gap-4">
        <Input
          type="text"
          defaultValue={product.name}
          placeholder="Nome do produto"
          hint="Informe o nome do produto"
          {...register("name")}
        />
        {errors.name && (
          <p className="py-2 ms-1 text-xs text-error-500">{errors.name.message}</p>
        )}

        <div>
          <label className="text-xs ms-1 text-gray-500 dark:text-gray-300 mb-2 block">
            Descrição do produto
          </label>
          <textarea
            defaultValue={product.description}
            className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            placeholder="Descrição do produto"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-error-500">{errors.description.message}</p>
          )}
        </div>

        <Input
          type="number"
          placeholder="0.00"
          step={0.01}
          hint="Preço em R$"
          defaultValue={product.price}
          {...register("price")}
        />
        {errors.price && (
          <p className="mt-1 text-xs text-error-500">{errors.price.message}</p>
        )}
      </div>

      {/* Coluna 2 */}
      <div className="flex-1 flex flex-col gap-4">
        <Input
          defaultValue={product?.download_url}
          type="url"
          placeholder="https://exemplo.com/arquivo"
          hint="Link para download do produto digital"
          {...register("download_url")}
        />
        {errors.download_url && (
          <p className="mt-1 text-xs text-error-500">{errors.download_url.message}</p>
        )}

        {/* Imagem */}
        <div className="flex flex-col items-center gap-2">
          <Controller
            control={control}
            name="image"
            render={({ field }) => <FileInput {...field} onChange={(file) => field.onChange(file)} />}
          />
          {errors.image && <p className="mt-2 text-red-500 text-xs">{errors.image.message}</p>}
        </div>

        {/* Campos físicos */}
        {productType === "physical" && (
          <div className="transition-all duration-500 ease-in-out flex flex-col gap-4">
            <Input type="number" name="stock" placeholder="0" min={0} hint="Quantidade em estoque" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input type="number" name="weight" placeholder="0.00" step={0.01} hint="Peso em kg" />
              <Input type="text" name="dimensions" placeholder="Ex: 10x20x5 cm" hint="Largura x Altura x Profundidade" />
            </div>
          </div>
        )}

        {/* Ativo */}
        <div className="flex items-center space-x-2 py-4">
          <Controller
            name="is_active"
            control={control}
            defaultValue={product.is_active}
            render={({ field }) => <Switch label="Ativo" checked={field.value} onChange={field.onChange} color="blue" />}
          />
          {errors.is_active && (
            <p className="mt-1 text-xs text-red-500">{errors.is_active.message}</p>
          )}
        </div>
      </div>
    </div>
  </form>
</div>

  );
};

export default FormEditProduct;
