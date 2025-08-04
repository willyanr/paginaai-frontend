import React from 'react';


export const ListItemsTest: React.FC = ({ }) => {
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="">
                <div className="mt-6 space-y-8">
                    <div className="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl dark:border-brand-500 ">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>

                            <div className="flex flex-col items-center mx-5 space-y-1">
                                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">Botão de Conversão</h2>
                                <div className="px-2 text-xs text-brand-500 bg-gray-100 rounded-full sm:px-4 sm:py-1 dark:bg-gray-700 ">
                                    Disponível
                                </div>
                            </div>
                        </div>

                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-300">sads</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

