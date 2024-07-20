import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import { Language } from 'react-transliterate';

interface TranslateQuillProps {
  value: string;
  onChange: (content: string) => void;
  lang: Language;
}

const TranslateQuill: React.FC<TranslateQuillProps> = ({ value, onChange, lang }) => {
    console.log("lang check", lang)
    console.log("value check", value)
    const [editorContent, setEditorContent] = useState(value);

  const handleTransliterateChange = (text: string) => {
    console.log("text check", text)
    setEditorContent(text);
    onChange(text);
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleTransliterateChange}
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['link', 'image']
          ],
        }}
        formats={[
          'header', 'font', 'list', 'bullet',
          'bold', 'italic', 'underline',
          'align', 'link', 'image'
        ]}
      />
      <ReactTransliterate
        value={editorContent}
        onChangeText={handleTransliterateChange}
        lang={lang}
        renderComponent={(inputProps) => (
          <input
            {...inputProps}
            // style={{ display: 'none' }} // Hide the input field
          />
        )}
      />
    </div>
  );
};
export default TranslateQuill;