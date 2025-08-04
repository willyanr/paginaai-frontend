"use client";

import React from 'react';

import ListProjects from './ListProjects';


const TestAB = () => {
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b  border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-2xl">
        <div className="max-w-7xl px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Teste A/B de Landing Pages</h1>
              <p className="text-gray-600 mt-2 dark:text-gray-300 text-sm">Ao criar um teste A/B</p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="mx-auto py-8">
        <ListProjects />
      </div>
      
    </div>
  );
};

export default TestAB;