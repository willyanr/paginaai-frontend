import { DataCheckout } from "@/interfaces/checkout.interface"
import { Card } from "../ui/card/Card"
import { InfoCard } from "../ui/info/InfoCard"

interface Props {
    data: DataCheckout
}

export const CardTaxUser = ({ data }: Props) => {

    return (
       <div className="w-full">
      <Card className="w-full bg-primary border-2 border-primary/20 rounded-2xl p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-white text-center">
          Suas Taxas
        </h2>
        
        <div className="flex flex-col gap-8 w-full">
          {/* PIX D+1 Section */}
          <div className="bg-brand-500/15 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-brand-500 font-extrabold text-2xl sm:text-3xl lg:text-4xl order-2 sm:order-1">
                PIX D+1
              </h1>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="dark:text-white/80 text-sm font-medium">Disponível</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex flex-col gap-2">
                  <span className="dark:text-white/70 text-sm">Taxa de Depósito</span>
                  <span className="font-bold text-xl dark:text-white">R$ {data.tax_pix_in}</span>
                </div>
                <InfoCard size="xs" >
                  Por venda realizada na plataforma
                </InfoCard>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex flex-col gap-2">
                  <span className="dark:text-white/70 text-sm">Taxa de Saque</span>
                  <span className="font-bold text-xl dark:text-white">R$ {data.tax_pix_out}</span>
                </div>
                <InfoCard size="xs" >
                  Por saque realizado - valor fixo
                </InfoCard>
              </div>
            </div>
          </div>

          {/* CARTÃO D+2 Section */}
          <div className="bg-brand-500/15 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-brand-500 font-extrabold text-2xl sm:text-3xl lg:text-4xl order-2 sm:order-1">
                CARTÃO D+2
              </h1>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="dark:text-white/80 text-sm font-medium">Disponível</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex flex-col gap-2">
                  <span className=" dark:dark:text-white/70 text-sm">Taxa de Depósito</span>
                  <span className="font-bold text-xl dark:text-white">R$ {data.tax_card_in}</span>
                </div>
                <InfoCard size="xs" >
                  Por venda realizada na plataforma
                </InfoCard>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex flex-col gap-2">
                  <span className="dark:dark:text-white/70 text-sm">Taxa de Saque</span>
                  <span className="font-bold text-xl dark:text-white">R$ {data.tax_card_out}</span>
                </div>
                <InfoCard size="xs" >
                  Por saque realizado - valor fixo
                </InfoCard>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>


    )


}