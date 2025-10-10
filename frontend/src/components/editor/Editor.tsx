import grapesjs, { Editor } from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import plugin from 'grapesjs-preset-webpage';
import grapesFlexBox from 'grapesjs-blocks-flexbox';
import pt from '@/locale/pt-br';
import tailwindPlugin from 'grapesjs-tailwind';
import pluginForm from 'grapesjs-plugin-forms';
import Button from '../ui/button/Button';
import { useModalContext } from '@/context/ModalContext';
import { useProjects } from '@/context/ProjectsContext';
import { useRef, useState } from 'react';
import { useAlertContext } from '@/context/AlertContext';
import { UpdateProjectUserPayload } from '@/interfaces/projects.interface';
import { Modal } from '../ui/modal';
import { InfoCard } from '../ui/info/InfoCard';
import { useSession } from "next-auth/react";
export default function DefaultEditor() {

  const { projectSelected, isLoading, projectSelectedID, projectSelectedName, updateProject, fetchProjectsAssets } = useProjects();
  const editorRef = useRef<Editor | null>(null);
  const { onAlert } = useAlertContext();
  const { isOpen, openModal, closeModal } = useModalContext();
  const { data: session } = useSession();



  const onEditor = (editor: Editor) => {
    editorRef.current = editor;
    editor.Panels.removeButton('options', 'canvas-clear');

    if (
      projectSelected &&
      (typeof projectSelected === 'string' ||
        (typeof projectSelected === 'object' && !Array.isArray(projectSelected)))
    ) {
      try {
        const parsedData =
          typeof projectSelected === 'string'
            ? JSON.parse(projectSelected)
            : projectSelected;

        editor.loadProjectData(parsedData);
      } catch (err) {
        console.error('Erro ao parsear project_data', err);
      }
    }



    getImagesAssets();




    editor.BlockManager.add('image-normal', {
      label: 'Imagem Normal',
      category: 'Básico',
      attributes: { class: 'fa fa-image' },
      content: {
        type: 'image',
        src: '',
        classes: ['w-full', 'h-auto'],
        style: {
          width: '100%',
          height: 'auto',
        },
        components: [
          {
            type: 'image',
            src: '',
            alt: '',
          },
        ],
      },
    });
    const canvasDoc = editor.Canvas.getDocument();
    const link = canvasDoc.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    canvasDoc.head.appendChild(link);

    const styleManager = editor.StyleManager;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fontProperty = styleManager.getProperty('typography', 'font-family') as any;
    if (fontProperty) {
      const currentOptions = fontProperty.get('options') || [];
      fontProperty.set('defaults', 'Poppins, sans-serif');
      fontProperty.set('options', [
        ...currentOptions,
        { value: 'Poppins, sans-serif', name: 'Poppins' }
      ]);
    }


  };


  const OnSave = async () => {
    const editor = editorRef.current;
    if (editor) {
      try {
        if (projectSelectedID) {
          const fullHtml = editor.getHtml();
          // Extrai só conteúdo do <body>
          const bodyMatch = fullHtml.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im);
          const bodyContent = bodyMatch ? bodyMatch[1] : fullHtml;

          const payload: UpdateProjectUserPayload = {
            project: projectSelectedID,
            project_data: JSON.stringify(editor.getProjectData()),
            html: bodyContent,  // só o body
            css: editor.getCss() ?? null
          };

          await updateProject(payload, projectSelectedID);
          onAlert(true, 'success', 'Projeto publicado com sucesso!');
        }
      } catch (error: unknown) {
        const errorMessage =
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'Erro ao atualizar o projeto.';
        onAlert(true, 'error', errorMessage);
      }
    }
  };


  const clearProject = async () => {
    try {
      const editor = editorRef.current;
      if (editor) {
        editor.DomComponents.clear();
        editor.CssComposer.clear();
      }
    } catch {
      onAlert(true, 'error', 'Erro ao limpar projeto!')
    }

  };
  const getImagesAssets = async () => {
    const textBtn = document.querySelector('.gjs-mdl-header');
    if (textBtn) {
      textBtn.textContent =
        "Adicione ou selecione novas imagens, para escolher a imagem clique duas vezes.";
    }

    const editor = editorRef.current;
    if (!editor) return;

    try {
      const res = await fetchProjectsAssets();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const images = (res as any).data;

      if (!images || images.length === 0) {
        console.warn('Nenhuma imagem encontrada');
        return;
      }

      const am = editor.AssetManager;
      am.add(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        images.map((img: any) => ({
          type: 'image',
          src: img.src,
          name: img.name || img.title || 'Imagem',
        }))
      );
      am.render();
    } catch (error) {
      console.error('Erro ao obter imagens:', error);
    }
  };

  const [code, setCode] = useState("");


  const handleImport = () => {
    openModal('import-code')
    const editor = editorRef.current;
    if (code.trim() && editor) {
      editor.setComponents(code);
      editor.getModel().get('UndoManager').clear();
      closeModal();
      setCode("");
    }
  };






  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }



  return (
    <div className="max-h-screen">
      <style>{`
      .gjs-btn-prim {
        background-color: #ff9800;
        padding: 10px !important;
      }

      #gjs-am-uploadFile{
      border-radius: 25px !important;
      cursor: pointer;
      }
    `}</style>
      <div className="flex justify-between gap-4 mb-3 items-center ">
        <div className='flex flex-col'>
          <span className='dark:text-white text-semibold'>Voce está editando</span>
          <div className="flex items-center gap-3">
            <span className='dark:text-white text-xl font-medium'>{projectSelectedName}</span>
            <span className='dark:text-gray-300 cursor-pointer border-b' onClick={() => {
              openModal('project')
            }}>Trocar de projeto</span>
          </div>

        </div>

        <div className="flex justify-end gap-4 items-center">
          <div className="flex items-center gap-3">

            <button
              onClick={() => openModal('import-code')}
              className="flex items-center px-4 py-2 text-sm font-semibold rounded-full border border-brand-500 text-brand-500 hover:border-purple-500 hover:text-purple-500 transition"
            >
              <svg className='w-12 h-7' version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 282 282" width="282" height="282">
                <title>image</title>
                <defs>
                  <image width="191" height="192" id="img1" href="data:image/png;base64,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" />
                </defs>
                <style>
                </style>
                <use id="Camada 1" href="#img1" x="57" y="36" />
              </svg>
              Importar código de IA
            </button>


          </div>

          <Button
            size="sm"
            className='bg-red-500'
            onClick={() => {
              clearProject();
            }}
            isLoading={isLoading}
          >
            Desfazer tudo
          </Button>

          <Button
            size="sm"
            onClick={() => {
              OnSave();
            }}
            isLoading={isLoading}
          >
            Publicar Projeto
          </Button>

        </div>
      </div>
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: '100vh',
          storageManager: false,
          plugins: [plugin,
            grapesFlexBox,
            tailwindPlugin,
            pluginForm,

          ],
          pluginsOpts: {},
          i18n: { locale: 'pt', messages: { pt } },
          assetManager: {
            upload: process.env.NEXT_PUBLIC_UPLOAD_URL_GRAPES,
            uploadName: 'image',
            credentials: 'include',
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
              'Authorization': `Bearer ${session?.accessToken}`,
            },

          },



        }



        }
        onEditor={onEditor}
      />
      <div>

        {isOpen && (
          <Modal isOpen={isOpen("import-code")} onClose={closeModal} className="max-w-[700px] m-4 dark:text-white">
            <div
              className=" max-w-3xl mx-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                Importar Código HTML
              </h2>
              <div className='py-4'>
                <InfoCard
                  size='xs'
                >
                  Atenção: Antes de realizar essa função, salve seu projeto antes, você pode correr o risco de perder todos os dados do projeto
                </InfoCard>
              </div>
              <textarea
                rows={10}
                className="w-full border-2 border-dashed border-gray-500 dark:border-gray-600 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Cole seu código HTML aqui"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant='outline'
                  onClick={() => closeModal()}>
                  Cancelar
                </Button>
                <Button
                  variant='primary'
                  onClick={handleImport}
                >
                  Importar
                </Button>
              </div>
            </div>
          </Modal>
        )}

      </div>

    </div>
  );
}
