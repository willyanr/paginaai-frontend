import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext(undefined);


export const AlertProvider = ({ children }) => {
    const [ isAlert, setIsAlert ] = useState<boolean>(false);
    const [ typeAlert, setTypeAlert ] = useState<string>('');
    const [ messageAlert, setMessageAlert ] = useState<string>('');



    const onAlert = (isAlert: boolean, typeAlert: string, messageAlert: string) => {
     
        setIsAlert(isAlert);
        setTypeAlert(typeAlert);
        setMessageAlert(messageAlert);
        setTimeout(() => {
            setIsAlert(false);
            setTypeAlert('');
            setMessageAlert('');
        }, 3000); 

    };





  return (
    <AlertContext.Provider value={{ 
        isAlert,
        typeAlert,
        messageAlert,
        onAlert,
    }}
    >
      {children}
    </AlertContext.Provider>
  );
};


export const useAlertContext = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within a AlertProvider');
    }
    return context;
};