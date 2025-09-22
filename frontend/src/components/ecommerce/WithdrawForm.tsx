
import React, { useState } from 'react';
import { Smartphone, AlertCircle, Check, AlertCircleIcon } from 'lucide-react';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { InfoCard } from '../ui/info/InfoCard';
import { useCheckoutContext } from '@/context/CheckoutContext';
import { useAlertContext } from '@/context/AlertContext';


interface WithdrawFormProps {
  balance: number;
  taxPix: number;
}



export const WithdrawForm: React.FC<WithdrawFormProps> = ({ balance, taxPix }) => {
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('form'); // form, success
  const [numericAmount, setNumericAmount] = useState(0);
  const { requestWithdraw }  = useCheckoutContext();
  const { onAlert } = useAlertContext();

  const formatCurrency = (value: string | number) => {
    if (value === null || value === undefined || value === "") return "R$ 0,00";

    const strValue = typeof value === "number" ? value.toFixed(2).replace(".", "") : value;

    const numericValue = strValue.toString().replace(/\D/g, "");
    if (!numericValue) return "R$ 0,00";

    const formattedValue = (parseInt(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>)  => {
     const value = e.target.value.replace(/\D/g, "");
      const numeric = parseInt(value) / 100;
      setNumericAmount(numeric);

    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  function parseBRLToNumber(amount: string): number {
  if (!amount) return 0;

  // Remove tudo que não seja número ou vírgula
  const cleaned = amount
    .replace(/[^\d,]/g, '')   // remove R$, espaços, pontos etc.
    .replace(',', '.');       // troca vírgula por ponto

  const parsed = Number(cleaned);

  if (isNaN(parsed)) {
    console.warn(`Valor inválido recebido: "${amount}"`);
    return 0;
  }

  return parsed;
}

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handlePixKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setPixKey(formatted);
  };

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  const handleSubmit = async () => {
    if (!amount || !pixKey || !validateCNPJ(pixKey)) return;

    const cleanedPixKey = pixKey.replace(/[./-]/g, '');
    const formattedAmount = parseBRLToNumber(amount);

    console.log('AMOUNT:', amount, 'FORMATED VALUE:', formattedAmount)

    const payload = {
      amount: formattedAmount,
      pix_type: 'CNPJ',
      pix_key: cleanedPixKey

    }

    try{
      setIsLoading(true);
      await requestWithdraw(payload);
      setStep('sucess');
    } catch (error: unknown) {
      let message = 'Erro ao criar projeto.';
      if (error instanceof Error) {
        message = error.message;
      }
      onAlert(true,'error', message)

    } finally {
      setIsLoading(false);
      
    }
    
  };

  const resetForm = () => {
    setAmount('');
    setPixKey('');
    setStep('form');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Solicitar Saque</h2>
          </div>
        </div>

      </div>

      {step === 'form' ? (
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-300 flex items-center gap-2">
              R$
              Valor do Saque
            </label>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"

              required
            />
            <p className="text-xs text-gray-500">Valor mínimo: R$ 10,00</p>

            {Number(numericAmount ) > Number(balance) && (
              <div className="flex bg-brand-50 dark:bg-brand-500/16 rounded-xl w-full items-center p-1 px-2">
                <AlertCircleIcon
                className='text-brand-300'
                />
                <span className="text-brand-300 text-xs md:text-sm px-2 py-1 rounded">
                Saldo insuficiente
              </span>
              </div>
            )}


          </div>

          {/* PIX Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Chave PIX (CNPJ)
            </label>
            <Input
              type="text"
              value={pixKey}
              onChange={handlePixKeyChange}
              placeholder="00.000.000/0000-00"

              required
            />
            {pixKey && !validateCNPJ(pixKey) && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                CNPJ inválido
              </div>
            )}
            <InfoCard
            size='xs'
            >
              Saque será enviado para o CNPJ ou CPF do responsável da conta.
            </InfoCard>
          </div>

          {/* Info Alert */}
          <div className="bg-brand-50 dark:bg-brand-500/16 border border-brand-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm text-brand-300">
                <p className="font-medium mb-1">Informações importantes:</p>
                <ul className="space-y-1 text-brand-300">
                  <li>• Processamento em até 24 horas úteis</li>
                  <li>• Chave PIX deve estar em seu nome/empresa</li>
                  <li>• Taxa de processamento: {formatCurrency(taxPix)}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full px-5">
              <Button
              isLoading={isLoading}
              type="submit"
              size='sm'
              onClick={handleSubmit}
              disabled={!amount || !pixKey || !validateCNPJ(pixKey) || isLoading}
              className='w-full'
            >
             Sacar
            </Button>
            </div>
          </div>
        </div>
      ) : (
        // Success State
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Saque Solicitado!</h3>
          <p className="text-gray-400 mb-6">
            Sua solicitação de saque de <span className="text-brand-500 font-medium">{amount}</span> foi processada com sucesso.
          </p>
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs md:text-sm">Valor:</span>
              <span className="text-white font-medium text-xs md:text-sm">{amount}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs md:text-sm">Chave PIX:</span>
              <span className="text-white font-medium text-xs md:text-sm">{pixKey}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs md:text-sm">Previsão:</span>
              <span className="text-brand-400 text-xs md:text-sm">Até 24h úteis</span>
            </div>
          </div>
          <div className="flex justify-center w-full">
                <div className="w-full px-5">
                  <Button
                  type="submit"
                  size='sm'
                  onClick={resetForm}
                  disabled={!amount || !pixKey || !validateCNPJ(pixKey) || isLoading}
                  className='w-full'
                >
                Confirmar
                </Button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};
