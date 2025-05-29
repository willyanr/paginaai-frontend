import TestAB from '@/components/test-ab/TestAB';
import { TestsABProvider } from '@/context/TestsABContext';
import React from 'react';

const TestABPage: React.FC = () => {
    return (
        <TestsABProvider >
            <div>
                <TestAB />
            </div>
        </TestsABProvider>
    );
};

export default TestABPage;