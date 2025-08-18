import React, { useState, useEffect } from 'react';
import { FlaskConical, TestTube, Microscope, Beaker, Activity, CheckCircle } from 'lucide-react';
import { InfoCard } from '../ui/info/InfoCard';


const getProgressPercentage = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffInMs = now - createdTime;
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  const progress = Math.min((diffInMs / twentyFourHoursMs) * 100, 100);
  return progress.toFixed(2);
};




interface LabTestingCardProps {
  time: string;
}

const LabTestingCard: React.FC<LabTestingCardProps> = ({ time }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const percentage = getProgressPercentage(time);

  const testingSteps = [
    { icon: FlaskConical, label: "Preparando amostra", color: "text-brand-500" },
    { icon: TestTube, label: "Adicionando reagentes", color: "text-brand-500" },
    { icon: Beaker, label: "Misturando componentes", color: "text-brand-500" },
    { icon: Microscope, label: "Analisando resultados", color: "text-brand-500" },
    { icon: Activity, label: "Processando dados", color: "text-brand-500" },
    { icon: CheckCircle, label: "Teste concluído", color: "text-brand-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= testingSteps.length - 1) {
          setIsComplete(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [testingSteps.length]);

  const CurrentIcon = testingSteps[currentStep].icon;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">
          Teste de Laboratório
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-500 mx-auto rounded-full"></div>
      </div>

      {/* Animation Container */}
      <div className="relative h-32 mb-6 flex items-center justify-center">
        {/* Background Circle */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br bg-brand-500/40 shadow-inner"></div>

        {/* Animated Icon */}
        <div className={`relative z-10 transition-all duration-700 transform ${isComplete ? 'scale-110' : 'scale-100'
          }`}>
          <CurrentIcon
            size={48}
            className={`${testingSteps[currentStep].color} transition-colors duration-500 ${currentStep === testingSteps.length - 1 ? 'animate-pulse' : 'animate-bounce'
              }`}
          />
        </div>

        {/* Orbiting Particles */}
        <div className="absolute w-32 h-32 rounded-full bg-brand-500/15">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r from-brand-400 to-brand-400 rounded-full animate-spin`}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${16 + i * 4}px 0px`,
                animationDuration: `${2 + i * 0.5}s`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2 p-3">
          <span>Progresso</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-brand-500/10 rounded-full h-8">
          <div
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-8 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className='mt-3'>
        <InfoCard
          size='xs'
        >
          Assim que o teste A/B for finalizado, o projeto vencedor será exibido aqui automaticamente.
        </InfoCard>
      </div>



    </div>
  );
};

export default LabTestingCard;