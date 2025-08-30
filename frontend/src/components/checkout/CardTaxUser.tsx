import { DataCheckout } from "@/interfaces/checkout.interface"
import { Card } from "../ui/card/Card"
import { InfoCard } from "../ui/info/InfoCard"

interface Props {
    data: DataCheckout
}

export const CardTaxUser = ({ data }: Props) => {

    return (
        <div>
            <Card >
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Suas Taxas</h2>
                <div className="space-y-3 gap-4">
                    <div className="">
                       <div className="flex justify-between">
                            <div className="flex gap-3 items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Taxa de Depósito:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-300">R$ {data.tax_pix_in }</span>
                            </div>
                            <h1 className="text-white font-black lg:text-4xl px-4">PIX D+1</h1>
                       </div>
                        <InfoCard

                            size="xs"
                        >
                            Por venda realizada na plataforma.
                        </InfoCard>
                    </div>

                    <div className="">
                        <div className="flex gap-3 items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Taxa de Saque:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-300">R$ {data.tax_pix_out }</span>
                        </div>
                        <InfoCard

                            size="xs"
                        >
                            Por saque realizado na plataforma, valor fixo.
                        </InfoCard>
                    </div>

                </div>
                 <div className="space-y-3 gap-4 mt-5">
                    <div className="">
                       <div className="flex justify-between">
                            <div className="flex gap-3 items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Taxa de Depósito:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-300">R$ {data.tax_card_in }</span>
                            </div>
                            <h1 className="text-white font-black lg:text-4xl px-4">CARTÃO D+2</h1>
                       </div>
                        <InfoCard

                            size="xs"
                        >
                            Por venda realizada na plataforma.
                        </InfoCard>
                    </div>

                    <div className="">
                        <div className="flex gap-3 items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Taxa de Saque:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-300">R$ {data.tax_card_out }</span>
                        </div>
                        <InfoCard

                            size="xs"
                        >
                            Por saque realizado na plataforma, valor fixo.
                        </InfoCard>
                    </div>

                </div>
            </Card>

        </div>


    )


}