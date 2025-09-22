import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "react-qr-code";
import premiumGif from "../../public/images/brand/premium.gif"
import successGif from "../../public/images/brand/sucesso.gif"
import { useAuth } from "@/context/AuthContext";
import { useAlertContext } from "@/context/AlertContext";
import { useCheckoutContext } from "@/context/CheckoutContext";
import { CircleCheck } from "lucide-react";


interface ModalPremiumProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function ModalPremium({ isOpen, closeModal }: ModalPremiumProps) {

  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [step, setStep] = useState<number>(1);
  const { subscription } = useAuth();
  const { onAlert } = useAlertContext();
  const [pixCode, setPixCode] = useState<string>('');
  const { verifyPayment } = useCheckoutContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);

      // Volta para "Copiar" após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };
  const onSubmit = async () => {
    try {
      const stored = localStorage.getItem('qrcodePremium');
      let qr: string | null = null;
      let subscriptionId: string | null = null;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expires > new Date().getTime()) {
          qr = parsed.value; // QR code ainda válido
          subscriptionId = localStorage.getItem('subscriptionId');
        } else {
          localStorage.removeItem('qrcodePremium');
          localStorage.removeItem('subscriptionId');
        }
      }

      if (!qr) {
        const res = await subscription();
        qr = res?.last_payment_qrcode as string;
        subscriptionId = res?.id as string;

        if (qr && subscriptionId) {
          const expiration = new Date().getTime() + 30 * 60 * 1000;
          const payload = { value: qr, expires: expiration };
          localStorage.setItem('qrcodePremium', JSON.stringify(payload));
          localStorage.setItem('subscriptionId', subscriptionId);
          setStep(2);
        }
      } else {
        setStep(2);
      }

      if (subscriptionId) {
        startPolling(subscriptionId);
      }

      if (qr) {
        setPixCode(qr);
      }

    } catch (error: unknown) {
      let message = 'Erro ao criar inscrição.';
      if (error instanceof Error) {
        message = error.message;
      }
      onAlert(true, 'error', message);
    }
  };


  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (id: string) => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(async () => {
        try {
          const res = await verifyPayment(id);
          console.log("verifyPayment response:", res);

          if (res?.data === true) {
            setStep(3);
            stopPolling();
            localStorage.removeItem("qrcodePremium");
            localStorage.removeItem("subscriptionId");
          }
        } catch (err) {
          console.error("Erro no polling:", err);
        }
      }, 5000);
    },
    [verifyPayment, stopPolling]
  );

  useEffect(() => {
    if (!isOpen) {
      stopPolling();
    } else {
      const subscriptionId = localStorage.getItem("subscriptionId");
      if (subscriptionId) {
        startPolling(subscriptionId);
      }
    }
  }, [isOpen, startPolling, stopPolling]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="flex justify-center">
        <Image
          src={premiumGif}
          width={150}
          height={150}
          alt="premium-gif"

        />
      </div>
      <div className="">
        {step === 1 && (
          <>
            {/* Badge */}
            <div className="flex justify-end">
              <span className="flex items-center gap-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                <CircleCheck />
                ASSINE COM UM CLIQUE
              </span>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mt-2">
              Plano Premium
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1 mb-2">
              Aproveite todos os benefícios e potencialize suas vendas
            </p>

            {/* Benefícios */}
            <ul className="grid grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
              {/* Cabeçalho */}
              <li className="font-bold">Recursos</li>
              <li className="font-bold text-center">Free</li>
              <li className="font-bold text-center">Premium</li>

              {/* Páginas de vendas */}
              <li className="flex items-center gap-2">Páginas de vendas</li>
              <li className="text-center">1</li>
              <li className="text-center">5</li>

              {/* Domínios próprios */}
              <li className="flex items-center gap-2">Domínios próprios</li>
              <li className="text-center">1</li>
              <li className="text-center">5</li>

              {/* Taxas PIX e cartão */}
              <li className="flex items-center gap-2">Taxas PIX / Cartão</li>
              <li className="text-center">Padrão</li>
              <li className="text-center text-green-500 font-semibold">Melhores taxas</li>

              {/* Suporte */}
              <li className="flex items-center gap-2">Suporte</li>
              <li className="text-center">Básico</li>
              <li className="text-center text-green-500 font-semibold">Personalizado</li>

              {/* Premiações */}
              <li className="flex items-center gap-2">Premiações por metas</li>
              <li className="text-center">—</li>
              <li className="text-center">✔️</li>

              {/* Uploads */}
              <li className="flex items-center gap-2">Uploads de fotos</li>
              <li className="text-center">Limitado</li>
              <li className="text-center">Ilimitado</li>

              {/* Produtos */}
              <li className="flex items-center gap-2">Cadastro de produtos</li>
              <li className="text-center">1</li>
              <li className="text-center">10</li>
            </ul>


            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="primary"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-400 dark:hover:bg-brand-500"
                onClick={() => onSubmit()}
              >
                Assinar com um clique
              </Button>

              <Button
                variant="outline"
                className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                onClick={closeModal}
              >
                Fechar
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-6 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl ">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Pagamento via PIX
            </h2>
            <p className="dark:text-gray-300 text-center md:w-72">Realize o pagamento para realizar sua assinatura, é na hora!</p>

            {/* QR Code */}
            <div className="border-3 rounded-xl border-dashed border-gray-400  p-3">
              <div className="bg-white p-4 rounded-xl shadow border-2">
                <QRCode value={pixCode} size={150} />
              </div>
            </div>


            {/* Código PIX */}
            <div className="w-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2 text-center">
                Código PIX (Copia e Cola):
              </p>
              <div className="flex-col justify-center gap-2 px-7">
                <textarea
                  readOnly
                  value={pixCode}
                  className="w-full border text-gray-500 rounded-xl p-2 text-sm dark:bg-gray-800 dark:text-gray-200"
                  rows={3}
                />
                <div className="flex justify-center">
                  <Button
                    className="mt-3"
                    variant="primary"
                    onClick={handleCopy}
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
              </div>
            </div>


          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 dark:bg-white/5 p-4 md:p-0 rounded-2xl w-full">
              <div className="flex justify-center ">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:w-96 md:mt-4">
                  Parabéns! Você se tornou Premium.
                </h2>
              </div>
              <div className="flex justify-center">
                <p className="dark:text-gray-300 text-center md:w-72 mt-3 md:mb-3">Seu pagamento foi recebido com sucesso! Agora você pode aproveitar todos os benefícios do Premium.</p>

              </div>
            </div>


            {/* QR Code */}
            <div className="flex justify-center">
              <Image
                src={successGif}
                width={150}
                height={150}
                alt="premium-gif"

              />
            </div>


            <div className="w-full">

            </div>


          </div>
        )}
      </div>
    </Modal>
  );
}
