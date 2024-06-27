import React from 'react';
import { useInputMode } from './text'; 

const InputModeSelector: React.FC = () => {
    const { inputMode, setInputMode } = useInputMode();

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputMode(value as 'english' | 'hindi');
    };

    return (
        <div>
            <input
                type="radio"
                id="english"
                name="inputMode"
                value="english"
                checked={inputMode === 'english'}
                onChange={handleRadioChange}
            />
            <label htmlFor="english">English</label>

            <input
                type="radio"
                id="hindi"
                name="inputMode"
                value="hindi"
                checked={inputMode === 'hindi'}
                onChange={handleRadioChange}
            />
            <label htmlFor="hindi">Hindi</label>
        </div>
    );
};

export default InputModeSelector;
