'use client';

import { useState } from 'react';
import { MODELS, getModelsByCategory, ModelCategory, CATEGORIES, getCategoryCounts } from '@/lib/models';
import { ModelCard } from '@/components/ModelCard';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');
  
  const counts = getCategoryCounts();
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  
  const filteredModels = selectedCategory === 'all' 
    ? MODELS 
    : getModelsByCategory(selectedCategory);
  
  const categories = Object.entries(CATEGORIES) as [ModelCategory, { label: string; icon: string; description: string }][];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Alibaba Model Studio
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Galería de modelos visuales gratuitos
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Todos ({totalCount})
          </button>
          
          {categories.map(([key, { label, icon }]) => {
            const count = counts[key];
            if (!count) return null;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {icon} {label} ({count})
              </button>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
        
        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No hay modelos en esta categoría
          </div>
        )}
      </main>
    </div>
  );
}