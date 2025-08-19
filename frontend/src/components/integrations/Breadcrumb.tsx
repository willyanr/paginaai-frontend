"use client";
import React, { useState } from 'react';
import { TrackersIntegrations } from './TrackersIntegrations';
import { Monitoring } from './Monitoring';


export const Breadcrumb = ({ }) => {
    const [activePageTracker, setActivePageTracker] = useState<boolean>(true);
    const [activePageMonitoring, setActivePageMonitoring] = useState<boolean>(false);

    const stateActivePages = (key: string) => {
        if (key === 'tracker') {
            setActivePageTracker(true);
            setActivePageMonitoring(false);
        } else if (key === 'monitoring') {
            setActivePageTracker(false);
            setActivePageMonitoring(true);
        }
    };

    return (
        <div className="w-full">
            <div className="border-2 border-gray-300 w-full p-4 md:p-6 rounded-xl dark:bg-gray-800 mb-5 dark:border-gray-600">
                <nav className="w-full" aria-label="Breadcrumb">
                    <ol className="flex flex-wrap gap-3 md:gap-0 items-center justify-start">
                        {/* Rastreamento */}
                        <li className="flex items-center">
                            <button
                                onClick={() => stateActivePages('tracker')}
                                className={`flex items-center text-sm md:text-base font-medium text-gray-500 py-2 px-4 md:px-5 rounded-full whitespace-nowrap dark:text-white transition-colors ${activePageTracker ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 hover:text-white'
                                    }`}
                            >
                                <svg
                                    className={`w-5 h-5 mr-2 ${activePageTracker ? 'text-white' : 'text-gray-500 dark:text-gray-300'
                                        }`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_11192_719)">
                                        <path
                                            d="M1.66663 4.99999C1.66663 3.15904 3.15901 1.66666 4.99996 1.66666C6.84091 1.66666 8.33329 3.15904 8.33329 4.99999C8.33329 6.84094 6.84091 8.33332 4.99996 8.33332C3.15901 8.33332 1.66663 6.84094 1.66663 4.99999Z"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        ></path>
                                        <path
                                            d="M1.66663 15C1.66663 13.4286 1.66663 12.643 2.15478 12.1548C2.64294 11.6667 3.42861 11.6667 4.99996 11.6667C6.57131 11.6667 7.35698 11.6667 7.84514 12.1548C8.33329 12.643 8.33329 13.4286 8.33329 15C8.33329 16.5713 8.33329 17.357 7.84514 17.8452C7.35698 18.3333 6.57131 18.3333 4.99996 18.3333C3.42861 18.3333 2.64294 18.3333 2.15478 17.8452C1.66663 17.357 1.66663 16.5713 1.66663 15Z"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                        ></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_11192_719">
                                            <rect width="20" height="20" fill="white"></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                                Rastreamento
                            </button>
                        </li>

                        {/* Divisor */}
                        <li className="hidden md:flex items-center">
                            <svg
                                className="w-1 h-5 mx-2"
                                viewBox="0 0 5 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.12561 1.13672L0.999943 18.8633"
                                    stroke="#E5E7EB"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        </li>

                        {/* Monitoramento */}
                        <li className="flex items-center">
                            <button
                                onClick={() => stateActivePages('monitoring')}
                                className={`flex items-center text-sm md:text-base font-medium text-gray-500 py-2 px-4 md:px-5 rounded-full whitespace-nowrap dark:text-white transition-colors ${activePageMonitoring ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 hover:text-white'
                                    }`}
                            >
                                Monitoramento
                            </button>
                        </li>

                        {/* Divisor */}
                        <li className="hidden md:flex items-center">
                            <svg
                                className="w-1 h-5 mx-2"
                                viewBox="0 0 5 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.12561 1.13672L0.999943 18.8633"
                                    stroke="#E5E7EB"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        </li>

                        {/* Gateway */}
                        <li className="flex items-center">
                            <a
                                href="javascript:;"
                                className="text-sm md:text-base font-medium text-gray-900 py-2 px-4 md:px-5 rounded-full whitespace-nowrap dark:text-white transition-colors hover:bg-brand-500 hover:text-white"
                            >
                                Gateway
                                <span className="py-1 px-2 bg-brand-500 text-white text-xs rounded-full ml-2">
                                    Em Breve
                                </span>
                            </a>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Conteúdo das páginas */}
            {activePageTracker && (
                <div className="w-full">
                    <TrackersIntegrations />
                </div>
            )}

            {activePageMonitoring && (
                <div className="w-full">
                    <Monitoring />
                </div>
            )}
        </div>

    );
};

