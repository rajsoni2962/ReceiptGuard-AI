import React, { useRef, useState } from 'react';
import { Upload, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReceiptUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onFileUpload, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.txt'];

  const validateAndUpload = (file: File) => {
    setErrorMessage(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Unsupported format '${ext}'. Please upload a PDF, PNG, JPG, or TXT receipt.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB maximum limit.');
      return;
    }

    onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer glass-card ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && validateAndUpload(e.target.files[0])}
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Drop your receipt here, or <span className="text-indigo-400 underline decoration-indigo-500/30">browse files</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, PNG, JPG, JPEG, TXT up to 10MB
            </p>
          </div>

          <div className="flex items-center space-x-4 pt-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Shopper-Isolated Vector Privacy</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Automatic Window Calculation</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
