// src/react-quill.d.ts
declare module 'react-quill' {
    import { Component } from 'react';
  
    interface QuillEditorProps {
      value: string;
      onChange: (content: string) => void;
      modules?: object;
      formats?: string[];
    }
  
    export default class ReactQuill extends Component<QuillEditorProps> {}
  }
  