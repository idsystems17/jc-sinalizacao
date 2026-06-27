import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Upload, X, Link } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUploader({ value, onChange, label, required }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    // reset para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  // Captura Ctrl+V com imagem — só quando não há valor e o uploader está visível
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (value) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) readFile(file);
        break;
      }
    }
  }, [value]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
      setUrlInput('');
      setShowUrl(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-gray-600 block">
          {label}{required && ' *'}
        </label>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 text-[10px] font-bold rounded-lg shadow hover:bg-gray-100"
            >
              Trocar foto
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={zoneRef}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all select-none ${
            isDragging
              ? 'border-[#FF4500] bg-orange-50 scale-[1.01]'
              : 'border-gray-200 hover:border-[#FF4500]/50 hover:bg-orange-50/30 bg-gray-50'
          }`}
        >
          <Upload className={`w-6 h-6 mx-auto mb-2 transition-colors ${isDragging ? 'text-[#FF4500]' : 'text-gray-400'}`} />
          <p className="text-xs font-bold text-gray-500">
            Arraste uma foto aqui ou <span className="text-[#FF4500]">clique para selecionar</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Ou cole com <kbd className="bg-gray-200 px-1 rounded text-[9px] font-mono">Ctrl+V</kbd> — JPG, PNG, WEBP
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Fallback para URL manual */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 font-mono transition-colors"
        >
          <Link className="w-3 h-3" />
          {showUrl ? 'Cancelar' : 'Usar URL de imagem'}
        </button>

        {showUrl && (
          <div className="flex gap-2 mt-1.5">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
              className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#FF4500] focus:outline-none font-mono"
              placeholder="/foto.jpg ou https://..."
              autoFocus
            />
            <button
              type="button"
              onClick={applyUrl}
              className="px-3 py-1.5 bg-[#FF4500] text-white text-xs font-bold rounded-xl hover:bg-orange-600 cursor-pointer"
            >
              Usar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
