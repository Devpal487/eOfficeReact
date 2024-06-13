import React, { useEffect, useRef } from 'react';

const QuillEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const Quill = window.Quill;
    if (Quill && editorRef.current) {
      new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  return <div ref={editorRef} style={{ height: '300px' }} />;
};

export default QuillEditor;
