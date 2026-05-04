'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Mic, Square, X, Image as ImageIcon } from 'lucide-react';
import type { ModelCategory } from '@/lib/models';

interface PromptInputProps {
  category: ModelCategory;
  requiresImage: boolean;
  supportsAudio: boolean;
  sizes?: string[];
  onGenerate: (data: { prompt: string; image?: string; audio?: string; size?: string }) => Promise<void>;
  isGenerating: boolean;
}

export function PromptInput({ category, requiresImage, supportsAudio, sizes, onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isOmni = category === 'omni';
  const isMultimodal = isOmni || category === 'llm';
  const canAddMedia = isMultimodal;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

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

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          setAudio(reader.result as string);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !isOmni) return;
    if (!image && !audio && requiresImage && !isOmni) return;

    await onGenerate({
      prompt: isOmni && !prompt.trim() ? 'Hello' : prompt.trim(),
      image: image || undefined,
      audio: audio || undefined,
      size: selectedSize || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload - for edit models or multimodal */}
      {(requiresImage || canAddMedia) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen {canAddMedia && !requiresImage && '(opcional)'}
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
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-full max-w-xs p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Subir imagen
            </button>
          )}
        </div>
      )}

      {/* Audio Upload / Recording - for multimodal models */}
      {supportsAudio && canAddMedia && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Audio (opcional)
          </label>
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            onChange={handleAudioUpload}
            className="hidden"
          />
          {audio ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">Audio cargado</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAudio(null)}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="flex-1 flex items-center justify-center p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Subir audio
              </button>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'border-2 border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Detener ({formatTime(recordingTime)})
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Grabar audio
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
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

      {/* Size Selection - for image models */}
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
        disabled={isGenerating || (!prompt.trim() && !isOmni) || (requiresImage && !image && !isOmni) || (requiresImage && canAddMedia && !image && !audio && !prompt.trim())}
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
