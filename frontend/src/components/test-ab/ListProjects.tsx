import { useProjects } from "@/context/ProjectsContext";
import React, { useEffect, useState } from "react";
import { BarChart3, Zap, CheckCircle, Circle, Info } from 'lucide-react';

import ListTestsAB from "./ListTestsAB";
import Button from "../ui/button/Button";
import { DataProjectUser } from "@/interfaces/projects.interface";
import ResultTestsAB from "./ResultTestsAB";
import { useTestsAB } from "@/context/TestsABContext";
import { useAlertContext } from "@/context/AlertContext";
import LabTestingCard from "./LabTestingCard";


const ListProjects: React.FC = () => {
  const { userProjects, fetchProjects } = useProjects();
  const { createNewProjectTest, isLoading, testsAB } = useTestsAB();
  const { onAlert } = useAlertContext();
  const [selectedProjects, setSelectedProjects] = useState<DataProjectUser[]>([]);
  const canStartTest = selectedProjects.length >= 2;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);



  const handleProjectSelect = (project: DataProjectUser) => {
    if (selectedProjects.find(p => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter(p => p.id !== project.id));
    } else if (selectedProjects.length < 3) {
      setSelectedProjects([...selectedProjects, project]);
    }

  };

  const startNewTestAB = async () => {

    if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
      try {
        const payload = {
          name: 'teste',
          variant_a_project: selectedProjects[0].id,
          variant_b_project: selectedProjects[1].id,
        }
        await createNewProjectTest(payload);
        onAlert(true, 'success', 'Teste criado com sucesso!');
        setSelectedProjects([]);
      } catch (error) {
        onAlert(true, 'error', error instanceof Error ? error.message : String(error))
      }
    }


  }

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
    <div className="">
      <div className="flex gap-9">


        {/* Sidebar com projetos selecionados */}
        <div className="w-1/2">
          <div className="bg-white rounded-xl p-6 sticky top-8 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-white">
              <BarChart3 className="w-5 h-5 text-brand-600 mr-2" />
              Projetos Selecionados
            </h3>

            <div className="space-y-3 mb-6">
              {selectedProjects.length === 0 ? (
                <p className="text-gray-500 text-lg text-center">Nenhum projeto selecionado</p>
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
                <span>{selectedProjects.length}/2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(selectedProjects.length / 2) * 100}%` }}
                ></div>
              </div>
            </div>


            {!canStartTest &&
              <button
                className={`w-full py-3 px-4 rounded-full font-semibold transition-all duration-200 ${canStartTest
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed rounded-2xl'
                  }`}

              > Selecione pelo menos 2 projetos
              </button>

            }
            {canStartTest &&
              <Button
                className="w-full"
                type="button"
                isLoading={isLoading}
                startIcon={<Zap className="w-4 h-4 mr-2" />}
                disabled={!canStartTest}
                onClick={() => startNewTestAB()}
              >
                Iniciar Teste A/B
              </Button>
            }
            {Array.isArray(testsAB) && testsAB.length > 0 ? (
              testsAB[0]?.winner_project ? (
                // ✅ Caso 1: Tem teste com vencedor
                <div className="mt-10">
                  <ResultTestsAB result={testsAB[0].winner_project_name} />
                </div>
              ) : (
                <div className="mt-6">
                  <LabTestingCard 
                  time={testsAB[0].created_at}
                  />
                </div>
              )
            ) : (
              <div className="bg-gray-100 flex gap-2 dark:bg-gray-800 mt-5 rounded-lg p-5">
                <div className="mt-5">
                  <Info className="dark:text-gray-300" />
                </div>
                <div className="text-gray-600 mt-4 text-sm leading-relaxed space-y-2 dark:text-gray-300 text-left w-80">
                  <p>
                    Ao ativar um <strong>teste A/B</strong>, nosso sistema exibirá automaticamente duas versões da sua página para diferentes visitantes.
                  </p>
                  <p>
                    Cerca de <strong>metade verá a Variante A</strong>, e a outra metade verá a <strong>Variante B</strong>.
                  </p>
                </div>
              </div>
            )}


          </div>

        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {userProjects.map((project) => {
              const isSelected = selectedProjects.find(p => p.id === project.id);
              const canSelect = selectedProjects.length < 2 || isSelected;

              return (
                <div
                  key={project.id}
                  className={`bg-white rounded-xl h-32 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 ${isSelected ? 'ring-2 ring-brand-500 bg-brand-50' : ''
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
                        : 'bg-brand-500/15 text-brand-500'
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${project.domain_verified ? 'bg-green-500' : 'bg-brand-500'
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
          <div className="w-full">
            <ListTestsAB />
          </div>
        </div>

      </div>

    </div>

  );
};

export default ListProjects;