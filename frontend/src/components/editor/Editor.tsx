"use client";
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { Block } from 'grapesjs';
import pt from '@/locale/pt'
import { useProjects } from '@/context/ProjectsContext';
import { useEffect, useState } from 'react';
import Button from '../ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { useModalContext } from '@/context/ModalContext';


export default function Editor({projectSelected, projectSelectedID}) {
  const { updateProject } = useProjects();
  const { openModal, isOpen } = useModalContext();
  



  return (
    <div className='h-screen w-full'>
      <StudioEditor
        options={{
          theme: 'light',
          layout: {
            default: {
              type: 'row',
              height: '100%',
              children: [
                {
                  type: 'canvasSidebarTop',
                  sidebarTop: {
                    leftContainer: {
                      buttons: ({ items }) => [
                        ...items,
                        {
                          id: 'openTemplatesButtonId',
                          size: 's',
                          icon: '<svg viewBox="0 0 24 24"><path d="M20 14H6C3.8 14 2 15.8 2 18S3.8 22 6 22H20C21.1 22 22 21.1 22 20V16C22 14.9 21.1 14 20 14M6 20C4.9 20 4 19.1 4 18S4.9 16 6 16 8 16.9 8 18 7.1 20 6 20M6.3 12L13 5.3C13.8 4.5 15 4.5 15.8 5.3L18.6 8.1C19.4 8.9 19.4 10.1 18.6 10.9L17.7 12H6.3M2 13.5V4C2 2.9 2.9 2 4 2H8C9.1 2 10 2.9 10 4V5.5L2 13.5Z" /></svg>',
                          onClick: ({ editor }) => {
                            editor.runCommand('studio:layoutToggle', {
                              id: 'my-templates-panel',
                              header: false,
                              placer: { type: 'dialog', title: 'Selecione um template pronto', size: 'l' },
                              layout: {
                                type: 'panelTemplates',
                                content: { itemsPerRow: 3 },
                                onSelect: ({ loadTemplate, template }) => {
                                  // Load the selected template to the current project
                                  loadTemplate(template);
                                  // Close the dialog layout
                                  editor.runCommand('studio:layoutRemove', { id: 'my-templates-panel' })
                                }
                              }
                            });
                          }
                        }
                      ]
                    }
                  },
                  grow: true
                },
                { type: 'sidebarRight' }
              ]
            }
          },
          templates: {
            // The onLoad can be an asyncronous function, so you can fetch templates from your API
            onLoad: async () => [
              {
                id: 'template1',
                name: 'Template 1',
                data: {
                  pages: [
                    {
                      name: 'Home',
                      component: `
            <div class="container">
              <header class="header">
                <h1 class="title">Template 1</h1>
              </header>
              <main class="main-content">
                <section class="intro">
                  <p>Bem-vindo ao Template 1! Este é um exemplo básico.</p>
                  <button class="btn">Clique aqui</button>
                </section>
              </main>
              <footer class="footer">
                <p>&copy; 2025 - Todos os direitos reservados.</p>
              </footer>
            </div>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
              .title {
                font-size: 4rem;
                margin: 0;
              }
              .main-content {
                background-color: #fff;
                padding: 20px;
                margin-top: 20px;
                border-radius: 8px;
              }
              .intro {
                text-align: center;
              }
              .btn {
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              }
              .btn:hover {
                background-color: #0056b3;
              }
              .footer {
                background-color: #333;
                color: #fff;
                text-align: center;
                padding: 10px;
                margin-top: 40px;
              }
              @media (max-width: 768px) {
                .title {
                  font-size: 2rem;
                }
                .main-content {
                  padding: 10px;
                }
                .btn {
                  width: 100%;
                  padding: 15px;
                }
              }
            </style>
          `
                    }
                  ]
                }
              },
              {
                id: 'template2',
                name: 'Template 2',
                data: {
                  pages: [
                    { component: '<h1 class="title">Template 2</h1><style>.title { color: blue; font-size: 10rem; text-align: center }</style>' }
                  ]
                }
              },
              {
                id: 'template3',
                name: 'Template 3',
                data: {
                  pages: [
                    { component: '<h1 class="title">Template 3</h1><style>.title { color: green; font-size: 10rem; text-align: center }</style>' }
                  ]
                }
              },
              {
                id: 'template4',
                name: 'Template 4',
                data: {
                  pages: [
                    { component: '<h1 class="title">Template 4</h1><style>.title { color: violet; font-size: 10rem; text-align: center }</style>' }
                  ]
                }
              },
            ]
          },
          blocks: {
            default: [
              {
                id: 'custom-header',
                label: 'Header',
                content: `
                  <header class="custom-header">
                      <h1 class="header-title">Bem-vindo ao meu site</h1>
                      <p class="header-subtitle">Explore o conteúdo abaixo</p>
                  </header>
              `,
                category: 'Basic',
                style: `
                    .custom-header {
                        background-color: black;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .header-title {
                        font-size: 2.5em;
                        margin: 0;
                    }
                    .header-subtitle {
                        font-size: 1.2em;
                        margin-top: 10px;
                    }
                    @media (max-width: 600px) {
                        .custom-header {
                            padding: 15px;
                        }
                        .header-title {
                            font-size: 2em;
                        }
                        .header-subtitle {
                            font-size: 1em;
                        }
                    }
                `
              }
            ]
          },
          i18n: {
            locales: 'pt', // default locale
            // detectLocale: true, // by default, the editor will detect the language
            // localeFallback: 'en', // default fallback
            messages: { pt },
          },


          licenseKey: 'DEMO_LOCALHOST_KEY',
          project: {
            type: 'web'
          },

          assets: {
            storageType: 'self',
            // Provide a custom upload handler for assets
            onUpload: async ({ files }) => {
              const body = new FormData();
              for (const file of files) {
                body.append('files', file);
              }
              const response = await fetch('ASSETS_UPLOAD_URL', { method: 'POST', body });
              const result = await response.json();
              // The expected result should be an array of assets, eg.
              // [{ src: 'ASSET_URL' }]
              return result;
            },
            // Provide a custom handler for deleting assets
            onDelete: async ({ assets }) => {
              const body = JSON.stringify(assets);
              await fetch('ASSETS_DELETE_URL', { method: 'DELETE', body });
            }
          },
          storage: {
            type: 'self',
            onSave: async ({ project, editor }) => {
              const body = new FormData();
              const html = editor.getHtml()
              const css = editor.getCss()
              const updatedProject = editor.getProjectData();
              body.append('id', projectSelectedID);
              body.append('name', project.name || 'Projeto sem nome');
              body.append('domain', project.domain || 'meusite-temporario.com');
              body.append('project_data', JSON.stringify(updatedProject));
              body.append('html', html);
              body.append('css', css);
              await updateProject(body);
            },
            onLoad: async () => {
              const project = projectSelected;
              if (!project) {
                return { project: {} };
              }
              return { project: project };
            },
           
            

            autosaveChanges: 100,
            autosaveIntervalMs: 10000
          }
          
        }}
      />


    </div>
  );
}