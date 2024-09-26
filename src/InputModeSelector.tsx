import React, { useState } from 'react';
import Languages from './Languages';
// import { useInputMode } from './text'; 

const InputModeSelector: React.FC = () => {
    const [lang, setLang] = useState("en");


    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // const { value } = event.target;
        //setInputMode(value as 'en' | 'hi');
        setLang(event.target.value )
    };

    return (
        <div>
            <input
                type="radio"
                id="english"
                name="inputMode"
                value="english"
                checked={lang === 'en'}
                onChange={handleRadioChange}
            />
            <label htmlFor="english">English</label>

            <input
                type="radio"
                id="hindi"
                name="inputMode"
                value="hindi"
                checked={lang === 'hi'}
                onChange={handleRadioChange}
            />
            <label htmlFor="hindi">Hindi</label>

            <select
        className="language-dropdown"
        value={lang}
        onChange={(e) => setLang(e.target.value )}
      >
        {Languages.map((l:any) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
        </div>
    );
};

export default InputModeSelector;


// import React from 'react';
// import { useInputMode } from './text'; 

// const InputModeSelector: React.FC = () => {
//     const { inputMode, setInputMode } = useInputMode();

//     const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const { value } = event.target;
//         setInputMode(value as 'english' | 'hindi');
//     };

//     return (
//         <div>
//             <input
//                 type="radio"
//                 id="english"
//                 name="inputMode"
//                 value="english"
//                 checked={inputMode === 'english'}
//                 onChange={handleRadioChange}
//             />
//             <label htmlFor="english">English</label>

//             <input
//                 type="radio"
//                 id="hindi"
//                 name="inputMode"
//                 value="hindi"
//                 checked={inputMode === 'hindi'}
//                 onChange={handleRadioChange}
//             />
//             <label htmlFor="hindi">Hindi</label>
//         </div>
//     );
// };

// export default InputModeSelector;
