"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Palette, Truck, CreditCard, Clock, Package, XIcon } from 'lucide-react';
import * as yup from "yup";
import { useForm, Controller, Control, Resolver  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from '@/components/form/input/FileInput';
import { InfoCard } from '@/components/ui/info/InfoCard';
import Switch from '@/components/form/switch/Switch';
import { Card } from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';
import { useCheckoutContext } from '@/context/CheckoutContext';
import { DataCheckout } from '@/interfaces/checkout.interface';
import { InfoPage } from '@/components/ui/info/InfoPage';
import { useAlertContext } from '@/context/AlertContext';

// Interface para o formulário
interface DataCheckoutForm {
    logo: File | string | null;
    banner: File | string | null;
    banner_mobile: File | string | null;
    is_frete: boolean;
    is_pix: boolean;
    is_card: boolean;
    is_countdown: boolean;
    is_frete_free: boolean;
    text_color_header: string;
    header_color: string;
    estimated_delivery: string;
    delivery_type: "correios" | "jadlog";
}

const CheckoutCustomizer = () => {
    const { checkout, refresh, updateCustomCheckout } = useCheckoutContext();
    const { onAlert } = useAlertContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userCheckout, setUserCheckout] = useState<DataCheckout | null>(null);
    const [previewImages, setPreviewImages] = useState<{
        logo?: string;
        banner_mobile?: string;
    }>({});

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (checkout && checkout.length > 0) {
            setUserCheckout(checkout[0]);
        }
    }, [checkout]);

    const validationSchema = yup.object().shape({
        logo: yup
            .mixed()
            .test(
                "required-logo",
                "Logo é obrigatória",
                value => value instanceof File || typeof value === "string"
            ),
        banner: yup.mixed().nullable(),
        banner_mobile: yup.mixed().nullable(),
        is_frete: yup.boolean().required(),
        is_pix: yup.boolean().required(),
        is_card: yup.boolean().required(),
        is_countdown: yup.boolean().required(),
        is_frete_free: yup.boolean().required(),
        text_color_header: yup
            .string()
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor deve estar no formato hexadecimal (#RRGGBB)")
            .required("Cor do texto é obrigatória"),
        header_color: yup
            .string()
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor deve estar no formato hexadecimal (#RRGGBB)")
            .required("Cor do header é obrigatória"),
        estimated_delivery: yup
            .string()
            .min(5, "Mínimo de 5 caracteres")
            .max(100, "Máximo de 100 caracteres")
            .required("Prazo de entrega é obrigatório"),
        delivery_type: yup
            .string()
            .oneOf(["correios", "jadlog"], "Tipo de entrega inválido")
            .required("Tipo de entrega é obrigatório"),
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<DataCheckoutForm>({
        resolver: yupResolver(validationSchema) as unknown as Resolver<DataCheckoutForm>,
        defaultValues: {
            logo: null,
            banner: null,
            banner_mobile: null,
            is_frete: false,
            is_pix: false,
            is_card: false,
            is_countdown: false,
            is_frete_free: false,
            text_color_header: "#ffffff",
            header_color: "#000000",
            estimated_delivery: "",
            delivery_type: "correios",
        },
    });

    useEffect(() => {
        if (userCheckout) {
            reset({
                logo: userCheckout.logo || null,
                banner: null,
                banner_mobile: userCheckout.banner_mobile || null,
                is_frete: userCheckout.is_frete,
                is_pix: userCheckout.is_pix,
                is_card: userCheckout.is_card,
                is_countdown: userCheckout.is_countdown,
                is_frete_free: userCheckout.is_frete_free,
                text_color_header: userCheckout.text_color_header || "#ffffff",
                header_color: userCheckout.header_color || "#000000",
                estimated_delivery: userCheckout.estimated_delivery || "",
                delivery_type: (userCheckout.delivery_type as "correios" | "jadlog") || "correios",
            });
        }
    }, [userCheckout, reset]);

    const watchedColors = watch(["header_color", "text_color_header"]);

    const onSubmit = async (data: DataCheckoutForm) => {
        setIsLoading(true);
        const form = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if ((key === "logo" || key === "banner_mobile") && !(value instanceof File)) return;
            if (value !== null && value !== undefined) {
                form.append(key, value as string | Blob);
            }
        });

        try {
            await updateCustomCheckout(form, userCheckout!.id);
            onAlert(true, 'success', 'Checkout Atualizado com sucesso.');
        } catch {
            onAlert(true, 'error', 'Erro ao atualizar checkout');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteImages = async () => {
        if (!userCheckout) return;

        setIsLoading(true);

        const form = new FormData();
        form.append("logo", "");
        form.append("banner", "");
        form.append("banner_mobile", "");

        try {
            await updateCustomCheckout(form, userCheckout.id);
            setPreviewImages({});
            onAlert(true, 'success', 'Imagens removidas com sucesso.');
        } catch {
            onAlert(true, 'error', 'Erro ao remover imagens.');
        } finally {
            setIsLoading(false);
        }
    };

    interface ColorFieldProps {
        name: keyof DataCheckoutForm;
        label: string;
        control: Control<DataCheckoutForm>;
        error?: { message?: string };
    }

    const ColorField: React.FC<ColorFieldProps> = ({ name, label, control, error }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="flex items-center space-x-3">
                        {/* Input de cor */}
                        <input
                            type="color"
                            {...field}
                            value={String(field.value) || "#ffffff"}
                            className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            {...field}
                            value={String(field.value) || "#ffffff"}
                            className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"}`}
                            placeholder="#ffffff"
                        />
                    </div>
                )}
            />

            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </div>
    );

    if (!userCheckout) return <p>Carregando...</p>;

    return (
        <div className={`min-h-screen transition-colors duration-300`}>
            <form className=" dark:bg-gray-900 min-h-screen" onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-7xl mx-auto">
                    <div className='mb-7'>
                        <InfoPage
                            title='Ajustes Checkout'
                            subtitle='Faça seus ajustes antes de publicar um produto.'
                        />
                    </div>
                    {/* Header */}

                    <div className="space-y-8">
                        {/* Seção de Imagens */}
                        <Card>
                            <div className="flex justify-between px-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Upload className="mr-2" size={20} />
                                    Imagens
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <span className='font-bold dark:text-white text-center flex justify-center'>Logo</span>
                                        <Controller
                                            control={control}
                                            name="logo"
                                            defaultValue={userCheckout?.logo}
                                            render={({ field }) => (
                                                <FileInput
                                                    label="Envie sua Logo"
                                                    {...field}
                                                    onChange={(file) => {
                                                        field.onChange(file);
                                                        if (file) {
                                                            const previewUrl = URL.createObjectURL(file);
                                                            setPreviewImages((prev) => ({
                                                                ...prev,
                                                                logo: previewUrl,
                                                            }));
                                                        } else {
                                                            setPreviewImages((prev) => ({
                                                                ...prev,
                                                                logo: undefined,
                                                            }));
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="">
                                        <span className='font-bold dark:text-white text-center flex justify-center'>Banner</span>
                                        <Controller
                                            control={control}
                                            name="banner_mobile"
                                            render={({ field }) => (
                                                <FileInput
                                                    label="Envie seu Banner"
                                                    {...field}
                                                    onChange={(file) => {
                                                        field.onChange(file);
                                                        if (file) {
                                                            const previewUrl = URL.createObjectURL(file);
                                                            setPreviewImages((prev) => ({
                                                                ...prev,
                                                                banner_mobile: previewUrl,
                                                            }));
                                                        } else {
                                                            setPreviewImages((prev) => ({
                                                                ...prev,
                                                                banner_mobile: undefined,
                                                            }));
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <Button
                                        startIcon={<XIcon />}
                                        type="button"
                                        onClick={() => {
                                            deleteImages();
                                            refresh();
                                        }}
                                    >
                                        Limpar
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Seção de Cores */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Palette className="mr-2" size={20} />
                                Cores do Header
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <ColorField
                                        name="header_color"
                                        label="Cor do Fundo"
                                        control={control}
                                        error={errors.header_color}
                                    />
                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'

                                        >
                                            Personalize a cor de fundo do Header
                                        </InfoCard>
                                    </div>
                                </div>
                                <div>
                                    <ColorField
                                        name="text_color_header"
                                        label="Cor do Texto"
                                        control={control}
                                        error={errors.text_color_header}
                                    />
                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'
                                            
                                        >
                                            Personalize a cor dos textos do Header
                                        </InfoCard>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="rounded-lg border-2 border-gray-200 dark:border-gray-600 mt-5"
                                style={{
                                    backgroundColor: watchedColors[0] || '#ffffff',
                                    color: watchedColors[1] || '#000000'
                                }}
                            >
                                <div className="flex items-center justify-between p-2 px-5">
                                    <div className="w-28 h-16 flex items-center justify-center overflow-hidden ">
                                        {userCheckout?.logo && !previewImages.logo ? (
                                            <img
                                                alt="Logo backend"
                                                src={userCheckout.logo}
                                                className="h-40 sm:h-14 md:h-40 lg:h-40 w-44 object-contain"
                                            />
                                        ) : previewImages.logo ? (
                                            <img
                                                alt="Logo preview"
                                                src={previewImages.logo}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">Nenhum logo</span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 px-4">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            ></path>
                                        </svg>
                                        <span
                                            className="text-sm font-bold text-justify uppercase text-[{{store.text_color_header }}] leading-4"
                                        >Pagamento <br />100% Seguro</span>
                                    </div>
                                </div>
                                {userCheckout?.banner_mobile && !previewImages.banner_mobile ? (
                                    <img
                                        alt="Banner backend"
                                        src={userCheckout.banner_mobile}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : previewImages.banner_mobile ? (
                                    <img
                                        alt="Banner preview"
                                        src={previewImages.banner_mobile}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 text-center flex justify-center mb-2">
                                        Nenhum Banner
                                    </span>
                                )}
                            </div>
                        </Card>

                        {/* Seção de Funcionalidades */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <CreditCard className="mr-2" size={20} />
                                Funcionalidades
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between border-2 border-dashed dark:border-gray-600 p-3 rounded-xl">
                                        <span className='flex gap-3 items-center font-semibold dark:text-white'>
                                            <Truck />
                                            Frete Ativo
                                        </span>
                                        <Controller
                                            name="is_frete"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    color="blue"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'
                                            
                                        >
                                            Isso só ficará ativo caso o seu produto seja físico
                                        </InfoCard>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between border-2 border-dashed dark:border-gray-600 p-3 rounded-xl">
                                        <span className='flex gap-3 items-center font-semibold dark:text-white'>
                                            <CreditCard />
                                            Pagamento via Pix
                                        </span>
                                        <Controller
                                            name="is_pix"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    color="blue"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'
                                            
                                        >
                                            Aceite pix como forma de pagamento em seu checkout
                                        </InfoCard>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between border-2 border-dashed dark:border-gray-600 p-3 rounded-xl">
                                        <span className='flex gap-3 items-center font-semibold dark:text-white'>
                                            <CreditCard />
                                            Pagamento via Cartão
                                        </span>
                                        <Controller
                                            name="is_card"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    color="blue"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'

                                        >
                                            Aceite cartões como forma de pagamento em seu checkout
                                        </InfoCard>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between border-2 border-dashed dark:border-gray-600 p-3 rounded-xl">
                                        <span className='flex gap-3 items-center font-semibold dark:text-white'>
                                            <Clock />
                                            Countdown
                                        </span>
                                        <Controller
                                            name="is_countdown"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    color="blue"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'
                                        >
                                            Adicione um contador em seu checkout o tempo padrão é de 10 minutos

                                        </InfoCard>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between border-2 border-dashed dark:border-gray-600 p-3 rounded-xl">
                                        <span className='flex gap-3 items-center font-semibold dark:text-white'>
                                            <Package />
                                            Ofereça Frete Grátis
                                        </span>
                                        <Controller
                                            name="is_frete_free"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    color="blue"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="p-2">
                                        <InfoCard
                                            size='sm'

                                        >
                                            Atenção: Esssa opção só ficará disponível em produtos físicos, detaque frete grátis em seu checkout
                                        </InfoCard>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Seção de Entrega */}
                        <Card className='p-6'>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Truck className="mr-2" size={20} />
                                Configurações de Entrega
                            </h2>
                            <div className="py-2">
                                <InfoCard
                                    size='sm'

                                >
                                    Essas configurações se aplicam somente em produtos físicos
                                </InfoCard>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className="flex-col gap-3 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tipo de Entrega
                                        </label>
                                        <Controller
                                            name="delivery_type"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${errors.delivery_type ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                >
                                                    <option value="correios">Correios</option>
                                                    <option value="jadlog">Jad Log</option>
                                                </select>
                                            )}
                                        />
                                        {errors.delivery_type && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.delivery_type.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Prazo de Entrega Estimado
                                        </label>
                                        <Controller
                                            name="estimated_delivery"
                                            control={control}
                                            defaultValue={userCheckout?.estimated_delivery}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${errors.estimated_delivery ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    placeholder="Ex: De 2 a 3 dias úteis."
                                                />
                                            )}
                                        />
                                        {errors.estimated_delivery && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimated_delivery.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className='w-40 px-5'>

                                </div>
                            </div>
                        </Card>

                        {/* Botão de Salvar */}
                        <div className="flex justify-end">
                            <Button
                                isLoading={isLoading}
                                type='submit'
                            >
                                Salvar Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutCustomizer;