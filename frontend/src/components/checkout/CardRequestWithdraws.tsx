import React from 'react';
import { DataWalletWithTransactions } from '@/interfaces/checkout.interface';
import { Card } from '../ui/card/Card';

interface CardRequestWithdrawsProps {
  withdraws: DataWalletWithTransactions;
}

export const CardRequestWithdraws: React.FC<CardRequestWithdrawsProps> = ({ withdraws }) => {
  const withdraw_requests = withdraws?.withdraw_requests || [];

  // Função util para formatar valores monetários
  const formatCurrency = (value: string | number) => {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Card className="h-72">
      <h2 className="text-xl font-bold mb-4 text-brand-400 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        Últimos Saques
      </h2>

      <div className="h-52 space-y-3 overflow-auto">
      {Array.isArray(withdraw_requests) && withdraw_requests.length > 0 ? (
            withdraw_requests.map((w) => (
            <div
              key={w.id}
              className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 mb-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium dark:text-white text-sm">Saque PIX</p>
                    <p className="text-xs text-gray-400">
                      {new Date(w.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-red-500 text-xs mb-2">
                    -{formatCurrency(w.amount)}
                  </p>
                  {w.status === 'pending' && (
                    <span className="bg-brand-500/20 text-brand-500 px-3 py-1 rounded-full text-xs ">
                      Pendente
                    </span>
                  )}
                  {(w.status === 'approved' || w.status === 'paid') && (
                    <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs ">
                      {w.status === 'approved' ? 'Aprovado' : 'Pago'}
                    </span>
                  )}
                   {(w.status === 'rejected' || w.status === 'cancelled') && (
                    <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs ">
                      {w.status === 'rejected' ? 'Rejeitado' : 'Cancelado'}
                    </span>
                  )}
                  {w.status !== 'pending' &&
                    w.status !== 'approved' &&
                    w.status !== 'paid' &&
                     w.status !== 'rejected' &&  (
                      <span className="status-failed px-2 py-1 rounded-full text-xs ">
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-400">Nenhum saque encontrado</p>
          </div>
        )}
      </div>
    </Card>
  );
};
