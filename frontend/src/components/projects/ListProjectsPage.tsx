import { useState, useEffect } from 'react';
import { Search, Globe, Copy, AlertTriangle, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Button from '../ui/button/Button';
import { useModalContext } from '@/context/ModalContext';
import { useProjects } from '@/context/ProjectsContext';
import Badge from '../ui/badge/Badge';
import { useAlertContext } from '@/context/AlertContext';
import Alert from '../ui/alert/Alert';
import DeleteModal from '../ui/alert/DeleteModal';
import Input from '../form/input/InputField';
import { PencilIcon } from '@/icons';

export default function ListProjectPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { openModal } = useModalContext();
  const { theme } = useTheme();
  const { userProjects, fetchProjects, deleteProject, updateProject } = useProjects();
  const { isAlert, typeAlert, messageAlert, onAlert } = useAlertContext();
  const [deleteDomainID, setDomainDelete] = useState<number>();
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [inputProjectName, setInputProjectName] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    fetchProjects();

  }, [fetchProjects]);

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true)
    }

  }, [theme]);

  const filteredProjects = (userProjects ?? []).filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    console.log(userProjects)

  }, [userProjects]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onAlert(true, 'success', 'Domínio copiado com Sucesso!')
  };

  const handleDeleteProject = async () => {
    if (deleteDomainID === undefined) return;
    try {
      await deleteProject(deleteDomainID);
      onAlert(true, 'success', 'Projeto excluido com sucesso!');
    } catch  {

    }

  };

  const handleEditProject = async (id: number) => {
    if (!inputProjectName) return;
    try {
      await updateProject({
        project: Number(id),
        name: inputProjectName[id]
      }, id)
      onAlert(true, 'success', 'Nome atualizado com sucesso!');
     } catch (error: unknown) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Erro ao atualizar o projeto.';
      onAlert(true, 'error', errorMessage)
    } finally {
      setEditingProjectId(null); 
      setInputProjectName({});
    }
  };



  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Navigation */}
      <nav className={`px-4 py-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-600`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="font-bold text-white">P</span>
            </div>
            <h1 className="text-xl font-bold">Projetos</h1>
          </div>

          <div className="flex items-center space-x-4">

            {/* <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 text-sm pr-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div> */}
            <div>
              <Button onClick={() => openModal("project")}>
                Novo Projeto
              </Button>

            </div>
          </div>
        </div>
      </nav>

      {/* Search bar for mobile */}
      <div className="md:hidden py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto py-6">


        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-600`}>
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando seu primeiro projeto!'}
            </p>
            <Button onClick={() => openModal("project")}>
              Criar novo Projeto
            </Button>
          </div>
        )}

      
        {(userProjects ?? []).length > 0 &&
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(userProjects ?? []).map((project) => (
              <div
                key={project.id}
                className={`rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 hover:shadow-2xl transition duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'
                  } border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                {/* Project header with gradient */}
                <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-400 relative">
                  {project.domain_verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Check size={12} className="mr-1" />
                      Domínio Verificado
                    </div>
                  )}
                </div>

                {/* Project content */}
                <div className="p-5">
                  {/* Edit input field */}
                  {editingProjectId === project.id ? (
                    <Input
                      className="mb-2"
                      placeholder="Digite o nome do Projeto"
                      defaultValue={inputProjectName[project.id] || project.name}
                      onChange={(e) => {
                        setInputProjectName((prev) => ({
                          ...prev,
                          [project.id]: e.target.value,
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold mb-1 truncate">{project.name}</h3>
                      <PencilIcon
                        className="cursor-pointer"
                        onClick={() => {
                          setEditingProjectId(project.id); // Ativa a edição apenas para o projeto clicado
                        }}
                      />
                    </div>
                  )}

                  {/* Project description */}
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description || 'Sem descrição'}
                  </p>

                  {/* Project info */}
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-y-2 mb-4`}>
                    <div className="flex items-center justify-between">
                      <span>Criado em:</span>
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Última atualização:</span>
                      <span>{formatDate(project.updated_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pixels:</span>
                      <Badge>{project.pixels.length}</Badge>
                    </div>
                  </div>

                  {/* Domain info */}
                  {project.domain && (
                    <div
                      onClick={() => copyToClipboard(project.domain.domain)}
                      className={`flex items-center space-x-2 mb-4 p-2 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <Globe size={16} className="text-orange-500" />
                      <span className="text-sm flex-1 truncate">{project.domain.domain}</span>
                      <Copy size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                  )}

                  {/* Buttons for removing or updating */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDomainDelete(project.id);
                        openModal('delete-domain');
                      }}
                    >
                      Remover
                    </Button>
                    {editingProjectId === project.id && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleEditProject(project.id); 
                        }}
                      >
                        Atualizar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


        }
      </main>


      {isAlert &&
        <div className="fixed top-24 right-4 z-50">
          <Alert
            message={messageAlert}
            variant={typeAlert as 'success' | 'error'}
            title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}
          />
        </div>

      }
      <DeleteModal
        onDelete={() => {
          handleDeleteProject();
        }}
      />

    </div>
  );
}