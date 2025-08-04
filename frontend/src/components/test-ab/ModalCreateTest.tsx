import React from 'react';
import { Modal } from '../ui/modal';
import { useModalContext } from '@/context/ModalContext';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { ListItemsTest } from './ListItemsTest';


export const ModalCreateTest: React.FC = () => {
    const { isOpen, closeModal } = useModalContext();
    return (
        <div>
            <Modal
                isOpen={isOpen("test-ab")}
                onClose={closeModal}
                className="max-w-[500px] m-4 dark:text-white"
            >
                <div className='p-5'>
                    <div>
                        <div className=''>
                            Projetos Selecionados
                        </div>
                        <div className='dark:bg-gray-800 mt-10 p-5 rounded-lg'>
                            <div>
                                <span>O que você quer testar?</span>
                            </div>
                        </div>
                        <div className='bg-red-50 mt-4 rounded-lg'>
                            <div>
                                <ListItemsTest />
                            </div>
                        </div>
                        <div className='flex justify-end mt-5'>
                            <Button>
                                Criar teste
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
