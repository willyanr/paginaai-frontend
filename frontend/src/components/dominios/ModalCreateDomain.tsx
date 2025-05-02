import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';



const ModalCreateDomain: React.FC = () => {
    const { isOpen, closeModal, openModal } = useModalContext();
    const [domainName, setDomainName] = useState<string | undefined>();
    const [isDomain, setIsDomain] = useState<boolean | undefined>();

    useEffect(() => {
        if (domainName) {
            setIsDomain(true);
        } else {
            setDomainName('')
            setIsDomain(false);
        }
    }, [domainName]);



    return (
        <div>
            <Modal isOpen={isOpen} onClose={()=> {
                closeModal();
                setDomainName('')
            }} className="max-w-[700px] m-4 dark:text-white">
                <div className="p-8">
                    <h2 className="text-lg font-bold mb-4">Vamos cadastrar seus domínios</h2>
                    <div className=''>
                        <p className="text-lg text-gray-600 mb-2 dark:text-white">Bora começar seu projeto, e escalar muito suas vendas!</p>
                        <div className="mb-3 py-2">
                            <div className=''>
                                <Label
                                    children="Cole seu domínio"
                                />
                                <Input
                                    type='text'
                                    placeholder='Digite um nome para seu primeiro projeto'
                                    onChange={(e) => setDomainName(e.target.value)}
                                />
                            </div>
                            {isDomain &&
                                <div>
                                    <div className="bg-gray-100 border text-gray-600 dark:bg-gray-800 dark:text-gray-200 mt-4 p-5 rounded-xl dark:border-gray-600">
                                        <div className="flex justify-between">
                                            <span className='font-semibold'>Domínio:</span>
                                            <h2 className='font-bold truncate px-3 w-2/3 justify-center flex'>
                                                {domainName}
                                            </h2>
                                            <Badge
                                                children='Não verificado'
                                                color='error'
                                                size='sm'
                                            />
                                        </div>
                                        <p className='text-center mt-3 text-sm dark:text-gray-200'>Você está cadastrando o seguinte domínio, deseja confirmar?</p>
                                    </div>
                                    <div className="flex justify-center py-1 mt-5">
                                        <Button
                                           
                                            children="Cadastrar novo domínio"
                                            variant='primary'
                                           
                                        />
                                    </div>
                                </div>
                            }
                        </div>

                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default ModalCreateDomain;