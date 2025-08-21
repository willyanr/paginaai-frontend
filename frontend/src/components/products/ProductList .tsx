import { useState } from 'react';
import { Edit,Package, Download, DollarSign, Box, Ruler, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/card/Card';
import { useProductsContext } from '@/context/ProductContext';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import FormEditProduct from './FormEditProduct';
import Image from 'next/image';
import { DataProduct } from '@/interfaces/products.interface';

const ProductList = () => {

    const { products, deleteProducts, refresh } = useProductsContext();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({});

    const startEdit = (product: DataProduct) => {
        setEditingId(product.id);
        setEditForm({ ...product });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

;



 

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
            <div className="max-w-7xl mx-auto">

                <div className="grid gap-6">
                    {products.map((product) => (
                        <Card key={product.id}>
                            {editingId === product.id ? (
                                // Modo de edição
                                <FormEditProduct
                                    product={product}
                                    setEditingId={setEditingId}
                                />
                            ) : (
                                // Modo de visualização
                                <div className="flex max-h-60">
                                    <div className="flex-shrink-0 p-6">
                                        <Image
                                            src={
                                                product.image instanceof File
                                                    ? URL.createObjectURL(product.image)
                                                    : String(product.image) || "/placeholder.png"
                                            }
                                            width={120}
                                            height={120}
                                            alt={product.name}
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                        />


                                    </div>

                                    <div className="flex-1 p-4 items-center">
                                        <div className="flex justify-between items-start mb-4 ">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 tr">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 t">
                                                        {product.name}
                                                    </h3>


                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-3 truncate max-w-40 text-sm">
                                                    {product.description}
                                                </p>
                                                <button
                                          
                                                    className={`inline-flex ms-2 mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${product.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                                        : 'bg-red-500/20 text-red-500 dark:bg-red-900 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-800'
                                                        }`}
                                                >
                                                    {product.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                                    {product.is_active ? 'Ativo' : 'Inativo'}
                                                </button>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.product_type === 'digital'
                                                    ? 'bg-brand-100 text-brand-500 dark:bg-brand-500/20 py-1 ms-2 dark:text-brand-200'
                                                    : 'bg-green-100 text-brand-500 dark:bg-brand-500/20 py-1 ms-2 dark:text-brand-200'
                                                    }`}>
                                                    {product.product_type === 'digital' ? <Download className="w-3 h-3 mr-1" /> : <Package className="w-3 h-3 mr-1" />}
                                                    {product.product_type === 'digital' ? 'Digital' : 'Físico'}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <Button
                                                    variant='outline'
                                                    onClick={() => startEdit(product)}

                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Editar
                                                </Button>

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center text-sm">
                                                <DollarSign className="w-4 h-4 mr-2 text-brand-500" />
                                                <span className="text-gray-600 dark:text-gray-400 mr-1">Preço:</span>

                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100 w-full">R$ {product.price}</span>

                                            <div className="flex items-center text-sm">
                                                <Box className="w-4 h-4 mr-2 text-brand-500" />
                                                <span className="text-gray-600 dark:text-gray-400 mr-1">Estoque: </span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{product.stock}</span>
                                            </div>

                                            {product.product_type === 'physical' && (
                                                <>
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400 mr-1">Peso:</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{product.weight}</span>
                                                    </div>

                                                    <div className="flex items-center text-sm">
                                                        <Ruler className="w-4 h-4 mr-2 text-brand-500" />
                                                        <span className="text-gray-600 dark:text-gray-400 mr-1">Dimensões:</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{product.dimensions}</span>
                                                    </div>
                                                </>
                                            )}

                                            {product.product_type === 'digital' && product.download_url && (
                                                <div className="flex items-center text-sm col-span-2">
                                                    <Download className="w-4 h-4 mr-2 text-brand-500" />
                                                    <span className="text-gray-600 dark:text-gray-400 mr-1">Download:</span>
                                                    <a
                                                        href={product.download_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 truncate max-w-48"
                                                    >
                                                        {product.download_url}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end">
                                            <div
                                                onClick={async () => {
                                                    try {
                                                        await deleteProducts(product.id);
                                                        refresh();
                                                    } catch (err: any) {
                                                        console.error("Erro ao deletar produto:", err.message);
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
                </div>

                {products.length === 0 && (
                    <div className="flex items-center justify-center min-h-[60vh]">
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
                )}

            </div>
        </div>
    );
};

export default ProductList;