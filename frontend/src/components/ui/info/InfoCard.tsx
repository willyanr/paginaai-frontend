import { Info } from 'lucide-react';
import React from 'react';

interface InfoProps {
    children?: React.ReactNode;
    size: 'sm' | 'xs'
}

export const InfoCard: React.FC<InfoProps> = ({ children, size }) => {
    const sizeClass = size === 'sm' ? 'text-base' : 'text-sm';

    return (
        <div className={`flex gap-4 dark:text-gray-300 ${sizeClass} items-center`}>
            <div>
                <Info
                className='w-5 h-5'
                />
            </div>
            {children}
        </div>
    );
};

