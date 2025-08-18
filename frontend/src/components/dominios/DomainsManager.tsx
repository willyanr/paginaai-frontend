
import React, { useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import YouTubeEmbed from '../ui/video/YouTubeEmbed';
import ModalCreateDomain from './ModalCreateDomain';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useModalContext } from '@/context/ModalContext';
import ListDomains from './ListDomains';







const DomainsManager: React.FC = () => {
    const { fetchProjectsDomains } = useProjectsDomains();
    const { openModal } = useModalContext();
    


    useEffect(() => {
        if (fetchProjectsDomains) {
            fetchProjectsDomains();
        }
    }, [fetchProjectsDomains]);


  

    return (
        <div className='flex gap-8'>

            <div className="py-4 border border-gray-200 rounded-2xl dark:border-gray-600 lg:p-6 mb-10 w-1/2 dark:bg-gray-800">
                <div className="p-6 space-y-4">

                    <div className="bg-gray-100 text-gray-500 dark:bg-gray-500/15 dark:text-gray-400 text-sm rounded-lg p-6">
                        <p className="mb-2 font-bold dark:text-white text-xl">1º Etapa</p>
                        <p className='text-sm'>
                            Cadastre seu domínio ao lado, remova (&#39;https://www.&#39; ou &#39;http://www.&#39;) e siga a próxima etapa.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-600 mb-2 dark:text-gray-400 px-2">Copie os Registros DNS:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Tipo</p>
                                <p className="font-semibold select-all text-brand-500">CNAME</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Nome</p>
                                <p className="font-semibold select-all text-brand-500">app</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Valor</p>
                                <p className="font-semibold select-all text-brand-500 break-all">api.paginaai.com.br</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 text-gray-500 dark:bg-gray-500/15 dark:text-gray-400 t text-sm rounded-lg p-6">
                        <p className="mb-2 font-bold dark:text-white text-xl">2º Etapa</p>
                        <p className="text-sm">
                            Para que seu domínio funcione corretamente, você precisa acessar o painel de gerenciamento do seu provedor de domínio (como GoDaddy, Registro.br, HostGator, etc).
                            Lá, vá até a seção de configurações de DNS e adicione um novo registro do tipo <strong>CNAME</strong>.
                            Use os dados fornecidos acima exatamente como estão.
                            Após salvar, aguarde até 4 horas para que as alterações sejam propagadas na internet.
                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex-1 border border-gray-300 dark:border-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-300 font-medium px-2 py-1">Propagação</p>
                            <Badge color='dark'>
                                Geralmente dentro de 30min
                            </Badge>
                        </div>
                        <div className="flex-1 border border-gray-300 dark:border-gray-800  rounded-lg p-4">
                            <p className="text-sm text-gray-300 font-medium px-2 py-1">Certificado SSL</p>
                            <Badge
                                color='success'
                                startIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.5-11a1.5 1.5 0 00-3 0v2.586l-.793.793a1.5 1.5 0 102.121 2.121l1.293-1.293A1.5 1.5 0 0011.5 7z" clipRule="evenodd" /></svg>}
                            >
                                Automático
                            </Badge>
                        </div>
                    </div>
                    <div className=''>
                        <YouTubeEmbed videoId="YOUR_VIDEO_ID_HERE" />
                    </div>
                </div>


            </div>
            <div className="mb-10 w-1/2 ">
                <div className="space-y-8">
                    <div className="flex justify-between p-6 border rounded-2xl items-center dark:bg-gray-800 dark:border-gray-600">
                        <h1 className="text-2xl text-gray-600 font-semibold dark:text-white">Gerenciador de Domínios</h1>
                        <Button
                            variant='primary'
                            size='sm'
                            onClick={()=> openModal("1")}
                        >
                            Adicionar Domínio +
                        </Button>
                    </div>
                  <ListDomains />

                </div>

            </div>
            <div>
                <ModalCreateDomain />
            </div>
           
          
        </div>

    );
};

export default DomainsManager;