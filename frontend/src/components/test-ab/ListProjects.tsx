import { useProjects } from "@/context/ProjectsContext";
import React, { useEffect, useState } from "react";
import { BarChart3, Zap, CheckCircle, Circle, List } from 'lucide-react';

import Label from '../form/Label';
import Select from '../form/Select';
import ListTestsAB from "./ListTestsAB";
import Button from "../ui/button/Button";


const ListProjects: React.FC = () => {
  const { userProjects, fetchProjects } = useProjects();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const canStartTest = selectedProjects.length >= 2;
  useEffect(() => {
    fetchProjects();
  }, []);


  const handleProjectSelect = (project) => {
    if (selectedProjects.find(p => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter(p => p.id !== project.id));
    } else if (selectedProjects.length < 3) {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  if (!userProjects) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }


  return (
    <div className="flex gap-9">
      {/* Sidebar com projetos selecionados */}
      <div className="w-1/2 h-100">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-white">
            <BarChart3 className="w-5 h-5 text-brand-600 mr-2" />
            Projetos Selecionados
          </h3>

          <div className="space-y-3 mb-6">
            {selectedProjects.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum projeto selecionado</p>
            ) : (
              selectedProjects.map((project, index) => (
                <div key={project.id} className="bg-brand-50 p-3 rounded-lg border border-brand-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <span className="bg-brand-600 text-white text-xs px-2 py-1 h-6 w-6 justify-center flex  rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  {/* <p className="text-xs text-gray-600 mt-1">
                    Taxa: {getConversionRate(project)}%
                  </p> */}
                </div>
              ))
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2 dark:text-white">
              <span>Progresso</span>
              <span>{selectedProjects.length}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(selectedProjects.length / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className='py-5'>
            <Label
              children="Selecione o dominio para iniciar o teste A/B"
            />
            <Select
              options={[
                { value: 'domain1', label: 'dominio1.com' },
                { value: 'domain2', label: 'dominio2.com' },
              ]} />
          </div>

         {!canStartTest && 
          <button
            className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 ${canStartTest
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed rounded-2xl'
              }`}

          > Selecione pelo menos 2 projetos
          </button>
         
         }
          {canStartTest && 
            <Button
            className="w-full"
              startIcon={<Zap className="w-4 h-4 mr-2" />}
              children='Iniciar Teste A/B'
              disabled={!canStartTest}
            />
          }
          
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 mt-5">
          <ListTestsAB />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {userProjects.map((project) => {
          const isSelected = selectedProjects.find(p => p.id === project.id);
          const canSelect = selectedProjects.length < 3 || isSelected;

          return (
            <div
              key={project.id}
              className={`bg-white rounded-xl shadow-lg h-40 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 ${isSelected ? 'ring-2 ring-brand-500 bg-brand-50' : ''
                } ${!canSelect ? 'opacity-60' : ''}`}
              onClick={() => canSelect && handleProjectSelect(project)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {isSelected ? (
                      <CheckCircle className="w-6 h-6 text-brand-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs ${project.domain_verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${project.domain_verified ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    {project.domain_verified ? 'Verificado' : 'Pendente'}
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-brand-500">
                              {(project.metrics.views / 1000).toFixed(1)}K
                            </p>
                            <p className="text-xs text-gray-500">Visualizações</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-brand-500">
                              {project.metrics.conversions}
                            </p>
                            <p className="text-xs text-gray-500">Conversões</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-brand-500">
                              {getConversionRate(project)}%
                            </p>
                            <p className="text-xs text-gray-500">Taxa</p>
                          </div>
                        </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProjects;