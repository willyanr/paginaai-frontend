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
import { useRef } from 'react';
import { TrashBinIcon } from '@/icons/index';
import Alert from '../ui/alert/Alert';
import { useAlertContext } from '@/context/AlertContext';
import { UpdateProjectUserPayload } from '@/interfaces/projects.interface';


export default function DefaultEditor() {
  const { openModal } = useModalContext();
  const { projectSelected, isLoading, projectSelectedID, projectSelectedName, updateProject, fetchProjectsAssets } = useProjects();
  const editorRef = useRef<Editor | null>(null);
  const { isAlert, onAlert, typeAlert, messageAlert } = useAlertContext();

  const onEditor = (editor: Editor) => {
    editorRef.current = editor;
    editor.Panels.removeButton('options', 'canvas-clear');
    const dataToLoad = {};
    if (dataToLoad && typeof dataToLoad === 'object' && !Array.isArray(dataToLoad) && projectSelected) {
      editor.loadProjectData(JSON.parse(projectSelected));
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
          const payload: UpdateProjectUserPayload = {
            project: projectSelectedID,
            project_data: JSON.stringify(editor.getProjectData()),
            html: editor.getHtml(),
            css: editor.getCss() ?? null
          }
          await updateProject(payload, projectSelectedID);
          onAlert(true, 'success', 'Projeto publicado com sucesso!');
        }

      } catch (error: unknown) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Erro ao atualizar o projeto.';
        onAlert(true, 'error', errorMessage)
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
    const editor = editorRef.current;
    if(editor){
      try {
      const res = await fetchProjectsAssets();
      console.log('RESPOSTA', res);

      if (!res || res.length === 0) {
        console.warn('Nenhuma imagem encontrada');
        return;
      }

      const am = editor.AssetManager;
      am.add(res.map(img => ({ type: 'image', src: img.url, name: img.title })));
      am.render();
    } catch (error) {
      console.error('Erro ao obter imagens:', error);
      alert('Erro ao obter imagens');
    }
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
      <div className="flex justify-between gap-4 mb-3 items-center ">
        <div className='flex justify-start px-3 items-center gap-5'>
          <Button
            size="sm"
            startIcon={<TrashBinIcon />}
            onClick={() => {
              clearProject();
            }}
            isLoading={isLoading}
          >
            Desfazer tudo
          </Button>
          <span className='text-white text-xl font-semibold'>Projeto: {projectSelectedName}</span>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              openModal("project")
            }}
          >
            Trocar de projeto
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
          height: '76vh',
          storageManager: false,
          plugins: [plugin,
            grapesFlexBox,
            tailwindPlugin,
            pluginForm,

          ],
          pluginsOpts: {},
          i18n: { locale: 'pt', messages: { pt } },
          assetManager: {
            upload: 'http://localhost:8081/api/images/',
            uploadName: 'image',
            credentials: 'include',
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
              'Authorization': 'Bearer ' + localStorage.getItem('access')
            },

          },



        }



        }
        onEditor={onEditor}
      />
      <div>
        {isAlert &&
          <div className="fixed bottom-24 right-4 z-50">
            <Alert
              message={messageAlert}
              variant={typeAlert as 'success' | 'error'}
              title={typeAlert === 'success' ? 'Sucesso' : 'Erro'}

            />
          </div>
        }
      </div>

    </div>
  );
}
