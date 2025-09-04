import { Monitor, Smartphone, ArrowRight, Edit3, Zap } from 'lucide-react';



export const IsMobile = () => {

return (
    <div className="min-h-screen flex items-center justify-center w-full lg:hidden bg-gray-50 dark:bg-gray-900">
  <div className="max-w-sm w-full lg:full">
    {/* Card Principal */}
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      
      {/* Header com Ícone */}
      <div className="bg-brand-500 dark:bg-brand-600 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-90"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 dark:bg-gray-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold mb-2">Editor de Páginas</h1>
          <p className="text-white/90 text-sm">Melhor experiência no desktop</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Ícones de Dispositivos */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-2">
              <Smartphone className="w-6 h-6 text-slate-400 dark:text-gray-300" />
            </div>
            <span className="text-xs text-slate-500 dark:text-gray-400">Mobile</span>
          </div>

          <ArrowRight className="w-5 h-5 text-brand-500 animate-pulse" />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-2 border border-brand-200 dark:border-gray-600">
              <Monitor className="w-6 h-6 text-brand-500 dark:text-brand-400" />
            </div>
            <span className="text-xs text-brand-500 dark:text-brand-400 font-medium">Desktop</span>
          </div>
        </div>

        {/* Mensagem Principal */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-2">
            Acesse pelo Desktop
          </h2>
          <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
            Para uma experiência completa com todas as funcionalidades do editor, 
            acesse nossa plataforma através do seu computador ou laptop.
          </p>
        </div>

        {/* Benefícios */}
        <div className="space-y-3 mb-6">
          {["Interface completa", "Melhor performance", "Tela maior"].map((text, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-50 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-3 h-3 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm text-slate-700 dark:text-gray-100 font-medium">{text}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {idx === 0 && "Todas as ferramentas disponíveis"}
                  {idx === 1 && "Processamento mais rápido"}
                  {idx === 2 && "Visualização otimizada"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Ação */}
        {/* Adicione seu botão aqui, se necessário */}

      </div>
    </div>

    {/* Footer */}
    <div className="text-center mt-6">
      <p className="text-xs text-slate-500 dark:text-gray-400">
        Disponível em breve para dispositivos móveis
      </p>
    </div>
  </div>
</div>

);

}