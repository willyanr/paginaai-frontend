import React, { useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import { AB } from '@/icons';
import { useTestsAB } from '@/context/TestsABContext';
import Button from '../ui/button/Button';
import { useModalContext } from '@/context/ModalContext';
import DeleteModal from '../ui/alert/DeleteModal';
import { useAlertContext } from '@/context/AlertContext';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { ListStatistic } from './ListStatistic';

const ListTestsAB: React.FC = () => {
    const { fetchTestsAB, testsAB, deleteProjectTest, isLoading } = useTestsAB();
    const { openModal } = useModalContext();
    const { onAlert } = useAlertContext();
    const { formatDateTime } = useDateFormatter();



    useEffect(() => {
        fetchTestsAB();
    }, [fetchTestsAB]);


    const deleteTest = async () => {
        if (Array.isArray(testsAB) && testsAB.length > 0) {
            try {
                const uniqueTest = testsAB[0];
                if (uniqueTest?.id) {
                    await deleteProjectTest(uniqueTest.id);
                    onAlert(true, 'success', 'Teste deletado com Sucesso.')
                }
                return;
            } catch {
                onAlert(true, 'error', 'Erro ao deletar teste.')
            } finally {

            }
        }
    }

    if (Array.isArray(testsAB) && testsAB.length > 0) {
        return (
            <div className='w-full'>
                <div className='border-2 rounded-lg p-3 flex justify-between items-center mt-5 dark:border-gray-600 dark:bg-gray-800'>
                    <div className='w-10 lg:w-40'>
                        <span className='font-semibold text-gray-700 dark:text-white lg:px-3'>
                            Testes Rodando:
                        </span>
                    </div>
                    <div>
                        <Button
                        size='sm'
                            isLoading={isLoading}
                            onClick={() => {
                                openModal('delete-domain');

                            }}
                        >
                            Cancelar Teste
                        </Button>
                    </div>
                </div>
                <div className='mt-5'>
                    {testsAB.map((item, index) => (
                        <div
                            key={index}
                            className='lg:flex justify-between gap-4'>
                            <div className='lg:w-1/2 p-6 rounded-xl  border-2 dark:border-gray-600 dark:bg-gray-800'>
                                <div className='flex justify-between items-center'>
                                    <div className="w-10 h-10 bg-brand-500/15 rounded-full flex items-center justify-center p-2">
                                        <AB className="text-brand-500" />
                                    </div>

                                    <Badge>
                                        {item?.variant_a_project_name.name}
                                    </Badge>
                                </div>
                                <div className='py-2'>
                                    <p className='dark:text-gray-400 text-xs lg:text-sm'>Criado em: {formatDateTime(item.created_at)}</p>
                                </div>
                                <div>
                                    <ListStatistic
                                        project={item.variant_a_project_name}
                                    />
                                </div>

                            </div>
                            <div className='lg:w-1/2 p-6 rounded-xl  border-2 dark:border-gray-600 dark:bg-gray-800 mt-10 lg:mt-0'>
                                <div className='flex justify-between items-center'>
                                    <div className="w-10 h-10 bg-brand-500/15 rounded-full flex items-center justify-center p-2">
                                        <AB className="text-brand-500" />
                                    </div>

                                    <Badge>
                                        {item?.variant_b_project_name.name}
                                    </Badge>
                                </div>
                                <div className='py-2'>
                                    <p className='dark:text-gray-400 text-sm'>Criado em: {formatDateTime(item.created_at)}</p>
                                </div>
                                <div>
                                    <ListStatistic
                                        project={item.variant_b_project_name}
                                    />
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
                <DeleteModal
                    onDelete={() => {
                        deleteTest();
                    }}
                />
            </div>


        );
    }
};

export default ListTestsAB;