'use client';

import { useState, useEffect } from 'react';
import { FiX, FiMaximize2, FiDownload } from 'react-icons/fi';
import { createPortal } from 'react-dom';

interface FigureTablePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'figure' | 'table';
  contentHtml: string;
  captionHtml: string;
  label: string;
}

export function FigureTablePreview({ isOpen, onClose, type, contentHtml, captionHtml, label }: FigureTablePreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-zoom-out" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-black/10 hover:bg-black/20 rounded-full lg:hidden text-gray-800"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Content Area (Left/Top) */}
        <div className="flex-1 bg-gray-50/50 flex items-center justify-center overflow-auto p-4 lg:p-12 custom-scrollbar border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className={`w-full ${type === 'figure' ? 'max-w-4xl' : ''}`}>
            {type === 'figure' ? (
              <div 
                className="figure-preview-image-container flex justify-center"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <div 
                className="table-preview-container overflow-x-auto custom-scrollbar bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}
          </div>
        </div>

        {/* Info Area (Right/Bottom) */}
        <div className="w-full lg:w-[400px] bg-white p-6 lg:p-10 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-academic-gold mb-1">{type === 'figure' ? 'Figure Preview' : 'Table Preview'}</span>
              <h3 className="text-xl font-black text-academic-navy uppercase tracking-tight">{label}</h3>
            </div>
            
            <button 
              onClick={onClose}
              className="hidden lg:flex p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Description / Caption</span>
              <div 
                className="text-sm leading-relaxed text-gray-700 font-serif ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: captionHtml }}
              />
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .figure-preview-image-container img {
          max-width: 100%;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-contain: contain;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .table-preview-container table {
          width: 100%;
          border-collapse: collapse !important;
          border: 1.5px solid #000 !important;
        }

        .table-preview-container th, 
        .table-preview-container td {
          border: 1px solid #000 !important;
          padding: 12px 16px !important;
          font-size: 13px !important;
          color: #1a1a1a !important;
        }

        .table-preview-container th {
          background-color: #f8fafc !important;
          font-weight: 800 !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>,
    document.body
  );
}

