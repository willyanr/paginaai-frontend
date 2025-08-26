import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`rounded-xl bg-white p-6 ${className} dark:bg-gray-800 border-2 dark:border-gray-600`}>
            {children}
        </div>
    );
};

