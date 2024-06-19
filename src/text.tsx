import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InputModeContextProps {
    inputMode: 'english' | 'hindi';
    setInputMode: (mode: 'english' | 'hindi') => void;
}

const InputModeContext = createContext<InputModeContextProps | undefined>(undefined);

export const InputModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputMode, setInputMode] = useState<'english' | 'hindi'>('english');

    return (
        <InputModeContext.Provider value={{ inputMode, setInputMode }}>
            {children}
        </InputModeContext.Provider>
    );
};

export const useInputMode = () => {
    const context = useContext(InputModeContext);
    if (!context) {
        throw new Error('useInputMode must be used within an InputModeProvider');
    }
    return context;
};
