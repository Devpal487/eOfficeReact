import React, { useState, useEffect } from 'react';
//import { convert_to_unicode2 } from './HindiUnicode'; // Import the conversion function
import { convertToUnicode } from './convertToUnicode ';

const TextConverter = ({ selectedLanguage }) => {
    const [text, setText] = useState('');

    const handleKeyUp = (event) => {
        console.log("Pressed Key:", event.key); 
        if (selectedLanguage === 'Hindi') {
            const convertedText = convertToUnicode(event.target.value);
            console.log("🚀 Converted text:", convertedText);
            setText(convertedText);
        } else {
            setText(event.target.value);
        }
    };

    return (
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleKeyUp}
        />
    );
};

export default TextConverter;
// export function convertToUnicode(text) {
