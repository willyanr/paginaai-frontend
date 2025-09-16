import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import React, { useState } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProductsContext } from "@/context/ProductContext";
import Switch from "../form/switch/Switch";
import { useAlertContext } from "@/context/AlertContext";
import { Save } from "lucide-react";
import FileInput from "../form/input/FileInput";



interface DataCreateNewProductForm {
  product_type: string;
  name: string;
  description: string;
  is_active: boolean;
  price: number;
  download_url?: string | null;
  stock?: number | null;
  weight?: number | null;
  dimensions?: string | null;
  image?: FileList | File;
}



const ProductForm: React.FC = () => {


  const { createProduct, products, refresh } = useProductsContext();
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const { onAlert } = useAlertContext();




  const createNewProduct = async (data: DataCreateNewProductForm) => {


    const formData = new FormData();
    if (data.image instanceof FileList) {
      formData.append("image", data.image[0]);
    } else if (data.image) {
      formData.append("image", data.image);
    }

    formData.append("product_type", data.product_type);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("download_url", data.download_url || "");
    formData.append("stock", String(data.stock || 0));
    formData.append("weight", String(data.weight || 0));
    formData.append("dimensions", data.dimensions || "");
    formData.append("is_active", String(data.is_active));


    const reponse = await createProduct(formData);
    onAlert(true, 'success', 'Produto criado com sucesso!')
    console.log(reponse)
    refresh();
    console.log(products)


  }


  const [productType, setProductType] = useState<string>("");


  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    product_type: yup.string().required("Selecione o tipo de produto"),
    name: yup
      .string()
      .required("O nome é obrigatório.")
      .matches(/^[^<>]*$/, "O nome não pode conter caracteres < ou >.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),

    description: yup.string().required("O nome é obrigatório"),
    is_active: yup.boolean().required("O nome campo é obrigatório"),
    price: yup.number().required("O preço é obrigatório").min(0, "Preço inválido"),
    download_url: yup.string().url("URL inválida").nullable(),
    stock: yup.number().min(0, "Estoque inválido").nullable(),
    weight: yup.number().min(0, "Peso inválido").nullable(),
    dimensions: yup.string().nullable(),
    image: yup
      .mixed<File | FileList>()
      .test("file-required", "A imagem é obrigatória", (value) => {
        // suporta File ou FileList
        return value && (value instanceof FileList ? value.length > 0 : true);
      })
      .test("fileSize", "O arquivo é muito grande", (value) => {
        if (!value) return true;

        const file = value instanceof FileList ? value[0] : value;
        return file.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Formato de arquivo não suportado", (value) => {
        if (!value) return true;

        const file = value instanceof FileList ? value[0] : value;
        return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      }),





  });

  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),

  });


  const onSubmit = async (data: DataCreateNewProductForm) => {
    setIsLoading(true);
    try {
      await createNewProduct(data);
      reset({
        product_type: "digital",
        name: "",
        description: "",
        is_active: true,
        price: 0,
        download_url: "",
        stock: null,
        weight: null,
        dimensions: "",
        image: undefined, 
      });

      setFileInputKey(Date.now());
      onAlert(true, 'success', 'Produto criado com sucesso!');
    } catch (error: unknown) {
      let message = 'Erro ao criar projeto.';
      if (error instanceof Error) {
        message = error.message;
      }
      onAlert(true,'error', message)

    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div>
      <form className=" mx-auto md:p-6 rounded-lg" onSubmit={handleSubmit(onSubmit)}>

        <div className="md:flex justify-between">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
              Tipo de Produto
            </label>

            <div className="relative w-44 h-12 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex items-center p-1">
              {/* Indicador de seleção */}
              <div
                className="absolute top-1 left-1 w-20  h-10 bg-brand-500 rounded-full shadow-md transition-all duration-300 ease-in-out"
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
                className={`relative w-1/2 h-full z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${productType === "digital" ? "text-white" : "text-white dark:text-white hover:text-gray-900"
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
                className={`relative w-1/2 h-full z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${productType === "physical" ? "text-white" : "text-white dark:text-white hover:text-gray-900"
                  }`}
              >
                Físico
              </button>
            </div>

            {errors.product_type && (
              <p className="mt-1 text-xs text-red-500">{errors.product_type.message}</p>
            )}
          </div>
          <div className="w-full md:flex justify-end">
            <Button
              size="sm"
              startIcon={<Save />}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              Cadastrar Produto
            </Button>
          </div>
        </div>



        {/* Nome do Produto */}
        <Input
          type="text"
          placeholder="Nome do produto"
          hint="Informe o nome do produto"
          {...register("name")}
          required
        />
        {errors.name && (
          <p className="py-2 ms-1 text-xs text-error-500">
            {errors.name.message}
          </p>
        )}

        {/* Descrição */}
        <div className="mt-3">
          <label className="text-xs ms-1 text-gray-500 dark:text-gray-300 mb-2">
            Descrição do produto
          </label>
          <textarea
            className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            placeholder="Descrição do produto"
            {...register("description")}
            required
          >

          </textarea>
          {errors.description && (
            <p className="mt-1 text-xs text-error-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Preço */}
        <Input
          type="number"
          placeholder="0.00"
          step={0.01}
          hint="Preço em R$"
          required
          {...register("price")}
        />
        {errors.price && (
          <p className="mt-1 text-xs text-error-500">
            {errors.price.message}
          </p>
        )}

        {/* URL para Download (Digital) */}
        {productType === "digital" && (
          <Input
            type="url"
            placeholder="https://exemplo.com/arquivo"
            hint="Link para download do produto digital"
            {...register("download_url")}
            required
          />
        )}
        {errors.download_url && (
          <p className="mt-1 text-xs text-error-500">
            {errors.download_url.message}
          </p>
        )}

        {/* Imagem */}
        <div className="py-4 flex justify-center">
          <div className=" flex flex-col items-center gap-2">
            <Controller
              
              control={control}
              name="image"
              render={({ field }) => <FileInput 
              key={fileInputKey}
              {...field} onChange={(file) => field.onChange(file)} />}
            />
            {errors.image && <p className="mt-2 text-red-500 text-xs">{errors.image.message}</p>}
          </div>
        </div>



        {productType === "physical" && (
          <div className="transition-all duration-500 ease-in-out">

            <Input
              type="number"
              name="stock"
              placeholder="0"
              min={0}
              hint="Quantidade em estoque"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                name="weight"
                placeholder="0.00"
                step={0.01}
                hint="Peso em kg"
              />
              <Input
                type="text"
                name="dimensions"
                placeholder="Ex: 10x20x5 cm"
                hint="Largura x Altura x Profundidade"
              />
            </div>
          </div>

        )}


        <div className="flex items-center mb-6 space-x-2 py-4">

          <Controller
            name="is_active"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <Switch
                label="Ativo"
                checked={field.value}
                onChange={field.onChange}
                color="blue"
              />
            )}
          />
          {errors.image && (
            <p className=" mt-2 text-red-500 text-xs mt-1">{errors.is_active?.message}</p>
          )}
        </div>

        {/* Botão */}

      </form>
    </div>
  );
};

export default ProductForm;
