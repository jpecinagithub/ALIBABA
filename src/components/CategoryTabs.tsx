'use client';

import { ModelCategory, CATEGORIES, getCategoryCounts } from '@/lib/models';

interface CategoryTabsProps {
  selected: ModelCategory | 'all';
  onSelect: (category: ModelCategory | 'all') => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const counts = getCategoryCounts();
  const categories = Object.entries(CATEGORIES) as [ModelCategory, { label: string; icon: string; description: string }][];
  
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect('all')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
            onClick={() => onSelect(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {icon} {label} ({count})
          </button>
        );
      })}
    </div>
  );
}