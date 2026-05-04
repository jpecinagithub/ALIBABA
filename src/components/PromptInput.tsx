'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { ModelCategory } from '@/lib/models';

interface PromptInputProps {
  category: ModelCategory;
  requiresImage: boolean;
  sizes?: string[];
  onGenerate: (data: { prompt: string; image?: string; size?: string }) => Promise<void>;
  isGenerating: boolean;
}

export function PromptInput({ category, requiresImage, sizes, onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOmni = category === 'omni';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !isOmni) return;

    await onGenerate({
      prompt: isOmni && !prompt.trim() ? 'Hello' : prompt.trim(),
      image: image || undefined,
      size: selectedSize || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {requiresImage && !isOmni && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen de entrada
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          {image ? (
            <div className="relative inline-block">
              <img
                src={image}
                alt="Uploaded"
                className="max-w-xs max-h-48 rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-full max-w-xs p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Subir imagen
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isOmni ? 'Pregunta o prompt' : 'Prompt'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isOmni ? 'Escribe tu pregunta o mensaje...' : 'Describe lo que quieres generar...'}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          required={!isOmni}
        />
      </div>

      {sizes && sizes.length > 0 && !isOmni && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isGenerating || (!prompt.trim() && !isOmni) || (requiresImage && !image && !isOmni)}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar'
        )}
      </button>
    </form>
  );
}
