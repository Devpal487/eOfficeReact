
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useInputMode } from './text';

const conversionMap: { [key: string]: string } = {
    "aa": "a",
    "ZZ": "Z",
    "=kk": "=k",
    "f=k": "f=",
    "Q+Z": "QZ+",
    "sas": "sa",
    "as": "sa",
    "‘": "\"",
    "’": "\"",
    "“": "'",
    "”": "'",
    "ƒ": "१",
    "„": "२",
    "…": "३",
    "†": "४",
    "‡": "५",
    "ˆ": "६",
    "‰": "७",
    "Š": "८",
    "‹": "९",
    "Œ": "०",
    "å": "०",
    "v‚": "ऑ",
    "vks": "ओ",
    "vkS": "औ",
    "vk": "आ",
    "v": "अ",
    "b±": "ईं",
    "Ã": "ई",
    "bZ": "ई",
    "b": "इ",
    "m": "उ",
    "Å": "ऊ",
    ",s": "ऐ",
    ",": "ए",
    "_": "ऋ",
    "d+": "क़",
    "[+": "ख़्",
    "x+": "ग़",
    "T+": "ज़्",
    "t+": "ज़",
    "M+": "ड़",
    "<+": "ढ़",
    "¶+": "फ़्",
    "Q+": "फ़",
    ";+": "य़",
    "j+": "ऱ",
    "u+": "ऩ",
    "d": "क",
    "D": "क्",
    "£": "ख्र",
    "[": "ख्",
    "x": "ग",
    "X": "ग्",
    "Ä": "घ",
    "?": "घ्",
    "³": "ङ",
    "p": "च",
    "P": "च्",
    "N": "छ",
    "t": "ज",
    "T": "ज्",
    ">": "झ",
    "÷": "झ्",
    "Ö": "झ्",
    "¥": "ञ",
    "V": "ट",
    "B": "ठ",
    "M": "ड",
    "<": "ढ",
    ".": "ण्",
    "r": "त",
    "R": "त्",
    "F": "थ्",
    "n": "द",
    "/": "ध्",
    "Ë": "ध्",
    "è": "ध्",
    "u": "न",
    "U": "न्",
    "i": "प",
    "I": "प्",
    "Q": "फ",
    "¶": "फ्",
    "c": "ब",
    "C": "ब्",
    "Ò": "भ",
    "H": "भ्",
    "e": "म",
    "E": "म्",
    ";": "य",
    "¸": "य्",
    "j": "र",
    "y": "ल",
    "Y": "ल्",
    "G": "ळ",
    "Üo": "श्व",
    "Ük": "श",
    "Üz": "श्र्",
    "o": "व",
    "O": "व्",
    "'": "श्",
    "\"": "ष्",
    "l": "स",
    "L": "स्",
    "g": "ह",
    "Ñ": "कृ",
    "—": "कृ",
    "ô": "क्क",
    "ä": "क्त",
    "{": "क्ष्",
    "K": "ज्ञ",
    "ê": "ट्ट",
    "Í": "ट्ट",
    "ë": "ट्ठ",
    "Î": "ट्ठ",
    "ð": "ठ्ठ",
    "Ï": "ड्ड",
    "ì": "ड्ड",
    "ï": "ड्ढ",
    "Ô": "ड्ढ",
    "Ù": "त्त्",
    "=": "त्र",
    "«": "त्र्",
    "–": "दृ",
    "Ì": "द्द",
    "í": "द्द",
    "\)": "द्ध",
    "˜": "द्भ",
    "ö": "द्भ",
    "|": "द्य",
    "}": "द्व",
    "é": "न्न",
    "™": "न्न्",
    "ó": "स्त्र",
    "â": "हृ",
    "à": "ह्न",
    "ã": "ह्म",
    "á": "ह्य",
    "º": "ह्",
    "J": "श्र",
    "Ø": "क्र",
    "Ý": "फ्र",
    "æ": "द्र",
    "ç": "प्र",
    "Á": "प्र",
    "#": "रु",
    ":": "रू",
    "Ó": "्य",
    "î": "्य",
    "z": "्र",
    "ª": "्र",
    "È": "ीं",
    "Ê": "Zी",
    "\›": "Zैं",
    "õ": "Zैं",
    "±": "Zं",
    "Æ": "र्f",
    "É": "र्Ç",
    "्k": "",
    "‚": "ॉ",
    "¨": "ो",
    "®": "ो",
    "ks": "ो",
    "©": "ौ",
    "kS": "ौ",
    "h": "ी",
    "q": "ु",
    "w": "ू",
    "`": "ृ",
    "s": "े",
    "¢": "े",
    "S": "ै",
    "a": "ं",
    "¡": "ँ",
    "%": "ः",
    "W": "ॅ",
    "•": "ऽ",
    "·": "ऽ",
    "~": "्",
    "+": "़",
    "k": "ा",
    "A": "।",
    "ñ": "॰",
    "\\": "?",
    " ः": " :",
    "^": "‘",
    "*": "’",
    "Þ": "“",
    "ß": "”",
    "(": ";",
    "¼": "(",
    "½": ")",
    "¿": "{",
    "À": "}",
    "¾": "=",
    "-": ".",
    "&": "-",
    //"&" ,	"µ" ,
    "]": ",",
    "@": "/",
    "~ ": "् ",
    "ाे": "ो",
    "ाॅ": "ॉ",
    "े्र": "्रे",
    "अौ": "औ",
    "अो": "ओ",
    "आॅ": "ऑ"
};

const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

interface EnglishToHindiConverterProps {
  label?: string;
  initialMode?: 'english' | 'hindi';
  onChange?: (convertedText: string) => void;
  englishPlaceholder?: string;
  hindiPlaceholder?: string;
  textFieldLabel?: React.ReactNode; 
  value:any;
  fieldname1:string;
  fieldname2:string;
  size?: 'small' | 'medium';  
  fullWidth:boolean;
  textFieldStyle?: React.CSSProperties;
  type?: 'text' | 'number' | 'email' | 'file';
}


const EnglishToHindiConverter: React.FC<EnglishToHindiConverterProps> = ({ label, initialMode = 'english', onChange, 
  englishPlaceholder , 
  hindiPlaceholder , 
  textFieldLabel ,
  value,
  fieldname1,
  fieldname2,
  size,
  fullWidth,
  textFieldStyle = {},
  type = 'text' 
}) => {
    const [inputText, setInputText] = useState<string>('');
    const { inputMode } = useInputMode();

    React.useEffect(() => {
        setInputText('');
    }, [inputMode]);

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const convertedText = inputMode === 'english' ? value : convertToHindi(value);
    setInputText(convertedText);
    if (onChange) {
        onChange(convertedText);
    }
};

const convertToHindi = (englishText: string): string => {
    let convertedText = englishText;

    Object.keys(conversionMap).forEach(key => {
        const regex = new RegExp(escapeRegExp(key), 'g');
        convertedText = convertedText.replace(regex, conversionMap[key]);
    });

    return convertedText;
};

    return (
        <div>
            <TextField
             type={type}
                value={inputText}
                onChange={handleInputChange}
                placeholder={inputMode === 'english' ? englishPlaceholder : hindiPlaceholder}
                fullWidth = {fullWidth}
                label={textFieldLabel}
                size={size}
                id={fieldname1}
                name={fieldname2}
                style={{ backgroundColor: 'white', ...textFieldStyle }}
            />
        </div>
    );
};

export default EnglishToHindiConverter;