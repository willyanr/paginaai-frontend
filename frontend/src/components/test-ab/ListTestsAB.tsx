import React, { useEffect } from 'react';
import Badge from '../ui/badge/Badge';
import { AB } from '@/icons';
import { useTestsAB } from '@/context/TestsABContext';
import Button from '../ui/button/Button';
import ResultTestsAB from './ResultTestsAB';


const ListTestsAB: React.FC = () => {
    const { fetchTestsAB, testsAB } = useTestsAB();


    useEffect(() => {
        fetchTestsAB();
    }, [fetchTestsAB]);

    if (testsAB) {
        return (
            <div>
                {true &&
                    <div>
                        {(Array.isArray(testsAB) ? testsAB : []).map((item, index) => (
                            <div
                                key={index}
                                className='border border-gray-200 rounded-lg p-6 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-600'>
                                <div>
                                    <div className="flex justify-between items-center py-4">
                                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{item?.name}</h2>
                                        <a href=""></a>
                                        <Badge
                                            startIcon={<AB className="w-4 h-4" />}
                                            size='sm'
                                        >
                                            Testando
                                        </Badge>
                                    </div>
                                </div>
                                <div className='mb-5'>
                                    <div className='flex justify-between items-center'>
                                        <div className='bg-brand-50 px-3 py-1 rounded-2xl text-brand-600 text-sm'>
                                            <span> {item?.variant_a_project_name?.name}</span>
                                        </div>
                                        <Badge
                                            size="md"
                                            startIcon={<AB className="w-6 h-6" />}
                                        >
                                            {' '}
                                        </Badge>

                                        <div className='bg-brand-50 px-3 py-1 rounded-2xl text-brand-600 text-sm'>
                                            <span> {item?.variant_b_project_name?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-400">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-brand-600">
                                            11221
                                        </p>
                                        <p className="text-xs text-gray-500">Visualizações</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-brand-600">
                                            12212
                                        </p>
                                        <p className="text-xs text-gray-500">Conversões</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-brand-600">
                                            12%
                                        </p>
                                        <p className="text-xs text-gray-500">Taxa</p>
                                    </div>
                                </div>
                                <div className='flex justify-center py-5'>
                                    {false &&
                                        <Button size='sm'>
                                            Ver Resultados
                                        </Button>
                                    }
                                    {true &&
                                        <Button
                                            size='sm'
                                            variant='outline'
                                        >
                                            Cancelar Teste A/B
                                        </Button>
                                    }
                                </div>
                            </div>
                        ))}

                    </div>

                }
                {false &&
                    <div>
                        <ResultTestsAB />
                    </div>
                }
            </div>

        );
    }
};

export default ListTestsAB;