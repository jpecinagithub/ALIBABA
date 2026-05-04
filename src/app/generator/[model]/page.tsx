'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModelById, CATEGORIES, Model } from '@/lib/models';
import { PromptInput } from '@/components/PromptInput';
import { ImagePreview } from '@/components/ImagePreview';
import { ArrowLeft, Info, ExternalLink, Loader2, MessageSquare } from 'lucide-react';

export default function GeneratorPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.model as string;
  
  const [model, setModel] = useState<Model | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const foundModel = getModelById(modelId);
    if (foundModel) {
      setModel(foundModel);
      setRemaining(foundModel.quota.remaining);
      fetchQuota(foundModel.id);
    }
  }, [modelId]);
  
  const fetchQuota = async (id: string) => {
    try {
      const res = await fetch('/api/quota?modelId=' + id);
      const data = await res.json();
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }
    } catch (e) {}
  };
  
  const handleGenerate = async (data: { prompt: string; image?: string; size?: string }) => {
    if (!model) return;
    
    setIsGenerating(true);
    setError(null);
    setResultUrl(null);
    setResultText(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          prompt: data.prompt,
          image: data.image,
          size: data.size,
        }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setResultUrl(result.url);
        fetchQuota(model.id);
      } else if (result.text) {
        setResultText(result.text);
        fetchQuota(model.id);
      }
    } catch (err) {
      setError('Error: ' + err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  const categoryInfo = CATEGORIES[model.category];
  const isOmni = model.category === 'omni';
  const quotaColor = remaining < model.quota.total * 0.2 ? 'text-red-500' : remaining < model.quota.total * 0.5 ? 'text-yellow-500' : 'text-green-500';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                  {categoryInfo?.icon} {categoryInfo?.label}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {model.name}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {model.description}
              </p>
              
              <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div className="text-gray-600 dark:text-gray-300">
                  {isOmni
                    ? 'Modelo multimodal. Ingresa un prompt de texto para obtener una respuesta.'
                    : model.category === 'llm'
                    ? 'Modelo de lenguaje. Ingresa un prompt para obtener una respuesta de texto.'
                    : 'Este modelo genera imágenes de forma síncrona. Los resultados se mostrarán en unos segundos.'
                  }
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Cuota disponible: <span className={'font-medium ' + quotaColor}>
                  {remaining >= 1000000 ? '∞' : remaining}/{model.quota.total >= 1000000 ? '∞' : model.quota.total}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <PromptInput
                category={model.category}
                requiresImage={model.requiresImage}
                sizes={model.options.sizes}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div>
            {resultUrl ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resultado
                </h2>
                <ImagePreview url={resultUrl} isVideo={false} />
              </div>
            ) : resultText ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Respuesta
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{resultText}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ingresa un prompt y genera para ver el resultado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}