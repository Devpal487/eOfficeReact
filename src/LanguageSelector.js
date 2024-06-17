import React, { useState, useEffect } from 'react';

const LanguageSelector = ({ onLanguageChange }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    useEffect(() => {
        onLanguageChange(selectedLanguage); // Pass the selected language to the parent component
        console.log("🚀 ~ useEffect ~ selectedLanguage:", selectedLanguage);
    }, [selectedLanguage, onLanguageChange]);

    return (
        <div>
            <input
                type="radio"
                id="english"
                name="language"
                value="English"
                checked={selectedLanguage === 'English'}
                onChange={(e) => setSelectedLanguage(e.target.value)}
            />
            <label htmlFor="english">English</label>
            
            <input
                type="radio"
                id="hindi"
                name="language"
                value="Hindi"
                checked={selectedLanguage === 'Hindi'}
                onChange={(e) => setSelectedLanguage(e.target.value)}
            />
            <label htmlFor="hindi">Hindi</label>
        </div>
    );
};

export default LanguageSelector;
