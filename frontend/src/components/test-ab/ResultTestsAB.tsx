import React from 'react';
import {Award, BarChart3 } from 'lucide-react';



const ResultTestsAB: React.FC = () => {
  const testData = {
    testName: "Botão CTA - Landing Page",
    duration: "14 dias",
    startDate: "10 Jan 2025",
    endDate: "24 Jan 2025",
    status: "Concluído",
    winner: "Variante B",
    confidence: 95.2,
    variants: {
      A: {
        name: "Controle",
        visitors: 5420,
        conversions: 324,
        conversionRate: 5.98,
        description: "Botão azul padrão"
      },
      B: {
        name: "Teste",
        visitors: 5380,
        conversions: 402,
        conversionRate: 7.47,
        description: "Botão laranja com sombra"
      }
    },
    improvement: 24.9,
    significance: "Estatisticamente significativo"
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-bold text-gray-800 flex items-center gap-3">
            <BarChart3 className="text-orange-500" size={32} />
            Resultados do Teste A/B
          </h1>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl text-sm font-semibold">
            {testData.status}
          </div>
        </div>
        <h2 className="text-sm text-gray-600 mb-2">{testData.testName}</h2>
        <p className="text-gray-500 text-sm">
          {testData.startDate} - {testData.endDate} • {testData.duration}
        </p>
      </div>

      {/* Winner Banner */}
      <div className="bg-brand-500 text-white p-6 rounded-2xl mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Award size={48} className="text-orange-200" />
            <div>
              <h3 className="text-sm font-bold">Vencedor: {testData.winner}</h3>
              <p className="text-orange-100 text-sm">
                Melhoria de {testData.improvement}% na conversão
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{testData.confidence}%</div>
            <div className="text-orange-200 text-sm">Confiança</div>
          </div>
        </div>
      </div>

      {/* Variants Comparison */}
     

     
    </div>
  );
};

export default ResultTestsAB;