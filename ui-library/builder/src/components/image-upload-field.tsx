import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploadFieldProps {
  value: string | undefined;
  onChange: (url: string) => void;
  label: string;
}

export function ImageUploadField({ value, onChange, label }: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      convertToBase64(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (text.startsWith("http")) {
      onChange(text);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium text-white/40">{label}</label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Logo"
            className="h-12 w-full object-contain rounded-md bg-white/[0.02] border border-white/[0.06]"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 rounded p-0.5"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onPaste={handlePaste}
          className={`flex flex-col items-center justify-center h-20 rounded-md border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? "border-blue-500/50 bg-blue-500/[0.05]"
              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]"
          }`}
        >
          <Upload className="h-4 w-4 text-white/20 mb-1" />
          <p className="text-[9px] text-white/30">
            Drop image or paste URL
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
