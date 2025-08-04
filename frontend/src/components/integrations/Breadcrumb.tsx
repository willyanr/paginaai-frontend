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
            <div className='border-2 border-gray-300 w-full p-6 rounded-lg dark:bg-gray-800 mb-5 dark:border-gray-600'>
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center ">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => stateActivePages('tracker')} 
                              className={`inline-flex items-center text-base font-medium text-gray-500 py-2 px-5 rounded-full whitespace-nowrap dark:text-white ${activePageTracker ? 'bg-brand-500 text-white' : ''}`}
                            >
                                    <svg className={`w-5 h-5 text-gray-500 mr-2 ${activePageTracker ? 'text-white' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_11192_719)">
                                        <path d="M1.66663 4.99999C1.66663 3.15904 3.15901 1.66666 4.99996 1.66666C6.84091 1.66666 8.33329 3.15904 8.33329 4.99999C8.33329 6.84094 6.84091 8.33332 4.99996 8.33332C3.15901 8.33332 1.66663 6.84094 1.66663 4.99999Z" stroke="currentColor" stroke-width="1.6"></path>
                                        <path d="M1.66663 15C1.66663 13.4286 1.66663 12.643 2.15478 12.1548C2.64294 11.6667 3.42861 11.6667 4.99996 11.6667C6.57131 11.6667 7.35698 11.6667 7.84514 12.1548C8.33329 12.643 8.33329 13.4286 8.33329 15C8.33329 16.5713 8.33329 17.357 7.84514 17.8452C7.35698 18.3333 6.57131 18.3333 4.99996 18.3333C3.42861 18.3333 2.64294 18.3333 2.15478 17.8452C1.66663 17.357 1.66663 16.5713 1.66663 15Z" stroke="currentColor" stroke-width="1.6"></path>
                                        <path d="M11.6666 4.99999C11.6666 3.42864 11.6666 2.64297 12.1548 2.15481C12.6429 1.66666 13.4286 1.66666 15 1.66666C16.5713 1.66666 17.357 1.66666 17.8451 2.15481C18.3333 2.64297 18.3333 3.42864 18.3333 4.99999C18.3333 6.57134 18.3333 7.35701 17.8451 7.84517C17.357 8.33332 16.5713 8.33332 15 8.33332C13.4286 8.33332 12.6429 8.33332 12.1548 7.84517C11.6666 7.35701 11.6666 6.57134 11.6666 4.99999Z" stroke="currentColor" stroke-width="1.6"></path>
                                        <path d="M11.6666 15C11.6666 13.159 13.159 11.6667 15 11.6667C16.8409 11.6667 18.3333 13.159 18.3333 15C18.3333 16.8409 16.8409 18.3333 15 18.3333C13.159 18.3333 11.6666 16.8409 11.6666 15Z" stroke="currentColor" stroke-width="1.6"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_11192_719">
                                            <rect width="20" height="20" fill="white"></rect>
                                        </clipPath>
                                    </defs>
                                </svg> Rastreamento </button>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className=" w-1 h-5 mx-2" viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.12561 1.13672L0.999943 18.8633" stroke="#E5E7EB" stroke-width="1.6" stroke-linecap="round"></path>
                                </svg>
                                <button
                                    onClick={() => stateActivePages('monitoring')} 
                                 className={`inline-flex items-center text-base font-medium text-gray-500 py-2 px-5 rounded-full whitespace-nowrap dark:text-white hover:bg-brand-500 cursor-pointer hover:text-white ${activePageMonitoring ? 'bg-brand-500 text-white' : ''}`}> Monitoramento
                                </button>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className=" w-1 h-5 mx-2" viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.12561 1.13672L0.999943 18.8633" stroke="#E5E7EB" stroke-width="1.6" stroke-linecap="round"></path>
                                </svg>
                                <a href="javascript:;" className="text-base font-medium text-gray-900 py-2 px-5 rounded-full hover:bg-brand-500 hover:text-white whitespace-nowrap dark-text-white dark:text-white">Gateway<span className="py-1 px-2 bg-brand-500 text-white text-xs rounded-full ml-3 group-hover:bg-white">Em Breve</span></a>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {activePageTracker && 
                <div className=''>
                    <TrackersIntegrations />
                </div>
            }
           
           
           {activePageMonitoring &&
            <div>
                <Monitoring />
            </div>
           }
        </div>
    );
};

