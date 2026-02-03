'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill').then(mod => mod.default), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-200" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'color', 'background'
];

export default function RichTextEditor({ value, onChange, label, placeholder }: RichTextEditorProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-academic-blue focus-within:border-academic-blue transition-all">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || 'Start typing...'}
          className="h-auto min-h-[200px]"
        />
      </div>
      <style jsx global>{`
        .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
          min-height: 150px;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .ql-container.ql-snow {
          border: none;
        }
        .ql-editor {
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}

