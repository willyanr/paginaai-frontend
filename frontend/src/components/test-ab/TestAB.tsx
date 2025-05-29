"use client";

import React from 'react';
import { TrendingUp } from 'lucide-react';

import ListProjects from './ListProjects';

const TestAB = () => {
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b  border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-2xl">
        <div className="max-w-7xl mx-auto  py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teste A/B de Landing Pages</h1>
              <p className="text-gray-600 mt-2 dark:text-gray-300">Selecione até 3 projetos para comparar performance</p>
            </div>
            <div className="flex items-center space-x-2 bg-brand-50 px-4 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-brand-800" />
              <span className="text-brand-800 font-semibold">Analytics Ready</span>
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