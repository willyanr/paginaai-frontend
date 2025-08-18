"use client";

import React from 'react';

import ListProjects from './ListProjects';
import { InfoPage } from '../ui/info/InfoPage';


const TestAB = () => {
  
  return (
    <div className="min-h-screen">
      {/* Header */}
       <InfoPage 
       
       title='Teste A/B'
       subtitle='Realize seus teste automáticos e converta muito mais!'

       />
      
      <div className="mx-auto py-8">
        <ListProjects />
      </div>
      
    </div>
  );
};

export default TestAB;