import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`rounded-xl bg-white p-4 ${className} dark:bg-gray-800 border dark:border-gray-600`}>
            {children}
        </div>
    );
};

