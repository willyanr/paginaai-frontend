
import React, { useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import Input from "../form/input/InputField";
import Label from "../form/Label";
import VideosExample from '../ui/video/VideosExample';
import YouTubeEmbed from '../ui/video/YouTubeEmbed';
import ModalCreateDomain from './ModalCreateDomain';
import { useProjectsDomains } from '@/context/DomainsContext';
import { useModalContext } from '@/context/ModalContext';







const DomainsManager: React.FC = () => {
    const { domainsData, fetchProjectsDomains } = useProjectsDomains();
    const { openModal } = useModalContext();

    useEffect(() => {
        fetchProjectsDomains();
    }, []);


    if(!domainsData){
        return(
            <div>
                <h1>tesssssssssssssssssssssssssss</h1>
            </div>
        )
    }


    return (
        <div className='flex gap-4'>
            <div className="py-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-10 w-1/2">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold dark:text-white">Configuração do domínio</h2>
                    <div className="py-1">
                        <Label>
                        </Label>
                        <Input type="text" defaultValue=''
                        />
                    </div>
                    <p className="text-sm text-gray-600 in-dark:text-gray-200">
                        Você está configurando: <strong className="text-black dark:text-gray-200">pagamento.smilesorrisos.top</strong>
                    </p>

                    <div className="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 text-sm rounded-lg p-4">
                        <p className="mb-2 font-medium">1º Etapa</p>
                        <p>
                            Cole seu domínio, remova ('https://www.' ou 'http://www.') e siga a próxima etapa.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-800 mb-2">Registros DNS do seu Checkout</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Tipo</p>
                                <p className="font-semibold select-all">CNAME</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Nome</p>
                                <p className="font-semibold select-all">app</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg dark:bg-brand-500/15 dark:text-white">
                                <p className="text-gray-500">Valor</p>
                                <p className="font-semibold select-all break-all">landing.exemplo.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 text-sm rounded-lg p-4">
                        <p className="mb-2 font-medium">2º Etapa</p>
                        <p className="text-sm ">
                            Para que seu domínio funcione corretamente, você precisa acessar o painel de gerenciamento do seu provedor de domínio (como GoDaddy, Registro.br, HostGator, etc).
                            Lá, vá até a seção de configurações de DNS e adicione um novo registro do tipo <strong>CNAME</strong>.
                            Use os dados fornecidos abaixo exatamente como estão.
                            Após salvar, aguarde até 4 horas para que as alterações sejam propagadas na internet.
                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex-1 border border-gray-300 dark:border-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Propagação</p>
                            <Badge
                                children="Aguardando..."
                                color='warning'

                            />
                        </div>
                        <div className="flex-1 border border-gray-300 dark:border-gray-800  rounded-lg p-4">
                            <p className="text-sm text-gray-500">SSL</p>
                            <Badge
                                children="Não instalado"
                                color='error'
                                startIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.5-11a1.5 1.5 0 00-3 0v2.586l-.793.793a1.5 1.5 0 102.121 2.121l1.293-1.293A1.5 1.5 0 0011.5 7z" clipRule="evenodd" /></svg>}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-4'>
                    <Button
                        children="Verificar domínio"
                        variant='primary'
                    />

                </div>


            </div>
            <div className="py-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-10 w-1/2">
                <div className="p-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold dark:text-white">Gerenciador de Domínios</h1>
                        <Button
                            variant='outline'
                            size='sm'
                            children="Adicionar Domínio +"
                            onClick={openModal}
                        />
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 dark:text-white">
                        {domainsData?.map((item, index) => (
                            <li
                                key={index}
                                className="border rounded-2xl p-6 shadow-sm dark:border-gray-800"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-medium mb-2">
                                            {item?.domain}
                                        </h2>
                                        <span className="text-xs font-normal text-gray-600 dark:text-gray-300">
                                            Cadastrado em: {item?.created_at}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge
                                            children={item?.verified ? 'Verificado' : 'Não verificado'}
                                            variant="light"
                                            color={item?.verified ? 'success' : 'error'}
                                        />
                                        <Badge 
                                        children="SSL"
                                        color={item?.ssl_enabled ? 'success' : 'error'}
                                        variant='light'
                                        />
                                     
                                    </div>
                                </div>
                                <div>
                                    <Badge 
                                    children={item.project_name}
                                    
                                    />
                                </div>
                                <div className="flex gap-2 mt-5">
                                <Button
                                    variant='primary'
                                    size='sm'
                                    children="Trocar Lading Page"
                                />
                                <Button
                                    variant='outline'
                                    size='sm'
                                    children="Remover"
                                />
                            </div>
                            </li>
                        ))}
                    </ul>

                    <div className=''>
                        <YouTubeEmbed />
                    </div>
                </div>

            </div>
            <div>
                <ModalCreateDomain />
            </div>
        </div>

    );
};

export default DomainsManager;