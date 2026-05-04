'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Model } from '@/lib/models';
import { Image, Edit3, Mic, MessageSquare } from 'lucide-react';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const [remaining, setRemaining] = useState(model.quota.remaining);
  
  useEffect(() => {
    fetch('/api/quota?modelId=' + model.id)
      .then(res => res.json())
      .then(data => {
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      })
      .catch(() => {});
  }, [model.id]);
  
  const getIcon = () => {
    switch (model.category) {
      case 't2i':
        return <Image className="w-6 h-6" />;
      case 'edit':
        return <Edit3 className="w-6 h-6" />;
      case 'omni':
        return <Mic className="w-6 h-6" />;
      case 'llm':
        return <MessageSquare className="w-6 h-6" />;
      default:
        return <Image className="w-6 h-6" />;
    }
  };
  
  const total = model.quota.total;
  const percentage = total > 0 ? (remaining / total) * 100 : 0;
  const quotaColor = percentage < 20 ? 'text-red-500' : percentage < 50 ? 'text-yellow-500' : 'text-green-500';
  
  return (
    <Link
      href={`/generator/${model.id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
          {getIcon()}
        </div>
        <span className={`text-xs font-medium ${quotaColor}`}>
          {remaining >= 1000000 ? '∞' : remaining}/{total >= 1000000 ? '∞' : total}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
        {model.name}
      </h3>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {model.description}
      </p>
    </Link>
  );
}