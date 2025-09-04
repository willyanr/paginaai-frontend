import { useState } from 'react';
import { Edit, Package, Download, DollarSign, Box, Ruler, Eye, EyeOff, Link, X } from 'lucide-react';
import { Card } from '../ui/card/Card';
import { useProductsContext } from '@/context/ProductContext';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import FormEditProduct from './FormEditProduct';
import Image from 'next/image';
import { DataProduct } from '@/interfaces/products.interface';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useAlertContext } from '@/context/AlertContext';

const ProductList = () => {

    const { products, deleteProducts, refresh } = useProductsContext();
    const { onAlert} = useAlertContext();
    const [editingId, setEditingId] = useState<boolean | number>(false);
    const [search, setSearch] = useState("");



    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const startEdit = (product: DataProduct) => {
        setEditingId(product!.id!);
    };






return (
  <div className="bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      {/* Busca */}
      <Card className="mb-5">
        <Label className="text-sm font-medium text-gray-600 mb-2 block">
          Busque pelo nome do produto
        </Label>

        <div className="relative w-full">
          

          <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
            <Input
              placeholder="Digite o nome do produto..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="pl-10 pr-10 py-2 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {search && (
              <Button
                size="sm"
                startIcon={<X />}
                variant="outline"
                type="button"
                onClick={() => setSearch("")}
                className="w-full sm:w-auto mt-2 sm:mt-0"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Produtos */}
      <div className="flex flex-col gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            {editingId === product.id ? (
              <FormEditProduct product={product} setEditingId={setEditingId} />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Imagem */}
                <div className="flex-shrink-0 p-4 sm:p-6 w-full sm:w-32 flex justify-center sm:justify-start">
                  <Image
                    src={
                      product.image instanceof File
                        ? URL.createObjectURL(product.image)
                        : String(product.image) || "/placeholder.png"
                    }
                    width={120}
                    height={120}
                    alt={product.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 flex flex-col justify-between w-full overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            product.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                              : "bg-red-500/20 text-red-500 dark:bg-red-900 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-800"
                          }`}
                        >
                          {product.is_active ? (
                            <Eye className="w-3 h-3 mr-1" />
                          ) : (
                            <EyeOff className="w-3 h-3 mr-1" />
                          )}
                          {product.is_active ? "Ativo" : "Inativo"}
                        </button>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.product_type === "digital"
                              ? "bg-brand-100 text-brand-500 dark:bg-brand-500/20 dark:text-brand-200"
                              : "bg-green-100 text-brand-500 dark:bg-brand-500/20 dark:text-brand-200"
                          }`}
                        >
                          {product.product_type === "digital" ? (
                            <Download className="w-3 h-3 mr-1" />
                          ) : (
                            <Package className="w-3 h-3 mr-1" />
                          )}
                          {product.product_type === "digital" ? "Digital" : "Físico"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end w-full sm:w-auto mb-4 lg:mb-4">
                      <Button variant="outline" onClick={() => startEdit(product)} className="w-full sm:w-auto">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>

                  {/* Detalhes responsivos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm w-full mt-2">
                    <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      <DollarSign className="w-4 h-4 text-brand-500" />
                      <span className="text-gray-600 dark:text-gray-400">Preço:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        R$ {product.price}
                      </span>
                    </div>

                    {product.product_type === "physical" && (
                      <>
                        <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          <Box className="w-4 h-4 text-brand-500" />
                          <span className="text-gray-600 dark:text-gray-400">Estoque:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.stock}</span>
                        </div>

                        <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-gray-600 dark:text-gray-400">Peso:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.weight}</span>
                        </div>

                        <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          <Ruler className="w-4 h-4 text-brand-500" />
                          <span className="text-gray-600 dark:text-gray-400">Dimensões:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.dimensions}</span>
                        </div>
                      </>
                    )}

                    {product.product_type === "digital" && product.download_url && (
                      <div className="flex items-center gap-1 col-span-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <Download className="w-4 h-4 text-brand-500" />
                        <span className="text-gray-600 dark:text-gray-400">Download:</span>
                        <a
                          href={product.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 truncate max-w-full"
                        >
                          {product.download_url}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-1 col-span-2 overflow-hidden text-ellipsis whitespace-nowrap">
                      <Link className="w-4 h-4 text-brand-500" />
                      <span className="text-gray-600 dark:text-gray-400">Link do Checkout:</span>
                      <a
                        href={product.url_checkout}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 truncate max-w-full"
                      >
                        {product.url_checkout}
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div
                      onClick={async () => {
                        try {
                          await deleteProducts(product!.id!);
                          refresh();
                          onAlert(true, "success", "Produto removido com sucesso.");
                        } catch {
                          onAlert(true, "error", "Erro ao remover produto.");
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <Badge color="dark" size="md">
                        Remover
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <Card>
            <div className="flex items-center justify-center min-h-[60vh] w-full">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                  Nenhum produto encontrado
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Adicione produtos para começar a gerenciar sua loja.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  </div>
);

};

export default ProductList;