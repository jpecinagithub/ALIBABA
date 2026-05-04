export type ModelCategory = 
  | 't2i'       
  | 'edit'
  | 'omni'
  | 'llm';

export type ModelType = 'sync';

export interface ModelQuota {
  remaining: number;
  total: number;
}

export interface Model {
  id: string;
  name: string;
  category: ModelCategory;
  type: ModelType;
  quota: ModelQuota;
  description: string;
  requiresImage: boolean;
  options: ModelOptions;
}

export interface ModelOptions {
  sizes?: string[];
  temperatures?: number[];
}

export const VALID_SIZES = [
  '1664x928',
  '1472x1104',
  '1328x1328',
  '1104x1472',
  '928x1664',
];

export const CATEGORIES: Record<ModelCategory, { label: string; icon: string; description: string }> = {
  t2i: { label: 'Texto a Imagen', icon: '🖼️', description: 'Genera imágenes a partir de texto' },
  edit: { label: 'Edición de Imagen', icon: '✏️', description: 'Edita imágenes existentes' },
  omni: { label: 'Multimodal', icon: '🎙️', description: 'Modelos multimodales de Alibaba' },
  llm: { label: 'LLM', icon: '💬', description: 'Modelos de lenguaje de Alibaba' },
};

export const MODELS: Model[] = [
  // Texto a Imagen (T2I)
  { id: 'qwen-image', name: 'qwen-image', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo base de generación de imágenes de Alibaba', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-2.0', name: 'qwen-image-2.0', category: 't2i', type: 'sync', quota: { remaining: 96, total: 100 }, description: 'Modelo de generación de imágenes v2.0 de Alibaba', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-max', name: 'qwen-image-max', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de generación de imágenes de máxima calidad', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-plus', name: 'qwen-image-plus', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de generación de imágenes plus', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-2.0-pro', name: 'qwen-image-2.0-pro', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de generación de imágenes profesional v2.0', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-max-2025-12-30', name: 'qwen-image-max-2025-12-30', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de última generación de máxima calidad', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-2.0-2026-03-03', name: 'qwen-image-2.0-2026-03-03', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de imágenes v2.0 actualizado', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-2.0-pro-2026-03-03', name: 'qwen-image-2.0-pro-2026-03-03', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo profesional actualizado', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'qwen-image-plus-2026-01-09', name: 'qwen-image-plus-2026-01-09', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo plus actualizado', requiresImage: false, options: { sizes: VALID_SIZES }},
  { id: 'z-image-turbo', name: 'z-image-turbo', category: 't2i', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo turbo de generación rápida', requiresImage: false, options: { sizes: VALID_SIZES }},

  // Edición de Imagen
  { id: 'qwen-image-edit', name: 'qwen-image-edit', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición de imágenes', requiresImage: true, options: {}},
  { id: 'qwen-image-edit-plus', name: 'qwen-image-edit-plus', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición de imágenes plus', requiresImage: true, options: {}},
  { id: 'qwen-image-edit-max', name: 'qwen-image-edit-max', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición de imágenes de máxima calidad', requiresImage: true, options: {}},
  { id: 'qwen-image-edit-plus-2025-10-30', name: 'qwen-image-edit-plus-2025-10-30', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición actualizado', requiresImage: true, options: {}},
  { id: 'qwen-image-edit-max-2026-01-16', name: 'qwen-image-edit-max-2026-01-16', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición máxima actualizado', requiresImage: true, options: {}},
  { id: 'qwen-image-edit-plus-2025-12-15', name: 'qwen-image-edit-plus-2025-12-15', category: 'edit', type: 'sync', quota: { remaining: 100, total: 100 }, description: 'Modelo de edición plus actualizado', requiresImage: true, options: {}},

  // Multimodal
  { id: 'qwen3.5-omni-plus', name: 'qwen3.5-omni-plus', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal plus de Qwen3.5', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-plus-2026-03-15', name: 'qwen3.5-omni-plus-2026-03-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal plus actualizado', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-flash', name: 'qwen3.5-omni-flash', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash de Qwen3.5', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-flash-2026-03-15', name: 'qwen3.5-omni-flash-2026-03-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash actualizado', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-plus-realtime', name: 'qwen3.5-omni-plus-realtime', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal plus en tiempo real', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-plus-realtime-2026-03-15', name: 'qwen3.5-omni-plus-realtime-2026-03-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal plus realtime', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-flash-realtime', name: 'qwen3.5-omni-flash-realtime', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash en tiempo real', requiresImage: false, options: {}},
  { id: 'qwen3.5-omni-flash-realtime-2026-03-15', name: 'qwen3.5-omni-flash-realtime-2026-03-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash realtime', requiresImage: false, options: {}},
  { id: 'qwen3-omni-flash', name: 'qwen3-omni-flash', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash de Qwen3', requiresImage: false, options: {}},
  { id: 'qwen3-omni-flash-2025-09-15', name: 'qwen3-omni-flash-2025-09-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash septiembre 2025', requiresImage: false, options: {}},
  { id: 'qwen3-omni-flash-realtime', name: 'qwen3-omni-flash-realtime', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash realtime', requiresImage: false, options: {}},
  { id: 'qwen3-omni-flash-realtime-2025-09-15', name: 'qwen3-omni-flash-realtime-2025-09-15', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal flash realtime', requiresImage: false, options: {}},
  { id: 'qwen-omni-turbo', name: 'qwen-omni-turbo', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal turbo', requiresImage: false, options: {}},
  { id: 'qwen-omni-turbo-realtime', name: 'qwen-omni-turbo-realtime', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal turbo en tiempo real', requiresImage: false, options: {}},
  { id: 'qwen-omni-turbo-realtime-2025-05-08', name: 'qwen-omni-turbo-realtime-2025-05-08', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal turbo', requiresImage: false, options: {}},
  { id: 'qwen-omni-turbo-2025-03-26', name: 'qwen-omni-turbo-2025-03-26', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal turbo', requiresImage: false, options: {}},
  { id: 'qwen2.5-omni-7b', name: 'qwen2.5-omni-7b', category: 'omni', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo multimodal de Qwen2.5', requiresImage: false, options: {}},

  // LLM Models
  { id: 'qwen-max-2025-03-25', name: 'qwen-max-2025-03-25', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen Max actualizado', requiresImage: false, options: {}},
  { id: 'qwen3-vl-235b-a22b-thinking', name: 'qwen3-vl-235b-a22b-thinking', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL de razonamiento 235B', requiresImage: false, options: {}},
  { id: 'qwen2.5-vl-72b-instruct', name: 'qwen2.5-vl-72b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL de 72B', requiresImage: false, options: {}},
  { id: 'qwen-vl-plus-2025-05-07', name: 'qwen-vl-plus-2025-05-07', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Plus actualizado', requiresImage: false, options: {}},
  { id: 'qwen-plus-2025-07-28', name: 'qwen-plus-2025-07-28', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Plus actualizado julio 2025', requiresImage: false, options: {}},
  { id: 'qwen-vl-plus-latest', name: 'qwen-vl-plus-latest', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Plus latest', requiresImage: false, options: {}},
  { id: 'qwen2.5-vl-3b-instruct', name: 'qwen2.5-vl-3b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL de 3B', requiresImage: false, options: {}},
  { id: 'qwen-max', name: 'qwen-max', category: 'llm', type: 'sync', quota: { remaining: 723311, total: 1000000 }, description: 'Modelo Qwen Max', requiresImage: false, options: {}},
  { id: 'qwen2.5-14b-instruct', name: 'qwen2.5-14b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo 14B', requiresImage: false, options: {}},
  { id: 'qwen-mt-flash', name: 'qwen-mt-flash', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Multitask Flash', requiresImage: false, options: {}},
  { id: 'qwen3-vl-30b-a3b-thinking', name: 'qwen3-vl-30b-a3b-thinking', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL de razonamiento', requiresImage: false, options: {}},
  { id: 'qwen3.6-plus', name: 'qwen3.6-plus', category: 'llm', type: 'sync', quota: { remaining: 991953, total: 1000000 }, description: 'Modelo Qwen 3.6 Plus', requiresImage: false, options: {}},
  { id: 'qwen3-32b', name: 'qwen3-32b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen 3 de 32B', requiresImage: false, options: {}},
  { id: 'qwen2.5-7b-instruct', name: 'qwen2.5-7b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo 7B', requiresImage: false, options: {}},
  { id: 'qwen-vl-max-2025-08-13', name: 'qwen-vl-max-2025-08-13', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Max actualizado', requiresImage: false, options: {}},
  { id: 'qwen-vl-plus', name: 'qwen-vl-plus', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Plus', requiresImage: false, options: {}},
  { id: 'qwen3.5-35b-a3b', name: 'qwen3.5-35b-a3b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo 35B A3', requiresImage: false, options: {}},
  { id: 'qwen-max-2025-01-25', name: 'qwen-max-2025-01-25', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Max actualizado', requiresImage: false, options: {}},
  { id: 'qwen3-coder-480b-a35b-instruct', name: 'qwen3-coder-480b-a35b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Coder 480B', requiresImage: false, options: {}},
  { id: 'qwen3-coder-plus', name: 'qwen3-coder-plus', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Coder Plus', requiresImage: false, options: {}},
  { id: 'qwen3-vl-8b-thinking', name: 'qwen3-vl-8b-thinking', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL de razonamiento 8B', requiresImage: false, options: {}},
  { id: 'qwen3-max-preview', name: 'qwen3-max-preview', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Max Preview', requiresImage: false, options: {}},
  { id: 'qwen3.5-flash-2026-02-23', name: 'qwen3.5-flash-2026-02-23', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Flash actualizado', requiresImage: false, options: {}},
  { id: 'qwen3-vl-flash-2025-10-15', name: 'qwen3-vl-flash-2025-10-15', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Flash', requiresImage: false, options: {}},
  { id: 'qwen3-8b', name: 'qwen3-8b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen 3 8B', requiresImage: false, options: {}},
  { id: 'qwen2.5-14b-instruct-1m', name: 'qwen2.5-14b-instruct-1m', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo 14B con 1M contexto', requiresImage: false, options: {}},
  { id: 'qwen-turbo', name: 'qwen-turbo', category: 'llm', type: 'sync', quota: { remaining: 999931, total: 1000000 }, description: 'Modelo Qwen Turbo', requiresImage: false, options: {}},
  { id: 'qwen3-0.6b', name: 'qwen3-0.6b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen 3 0.6B', requiresImage: false, options: {}},
  { id: 'qwen3-coder-flash', name: 'qwen3-coder-flash', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Coder Flash', requiresImage: false, options: {}},
  { id: 'qwen-vl-plus-2025-08-15', name: 'qwen-vl-plus-2025-08-15', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Plus', requiresImage: false, options: {}},
  { id: 'qwen3-next-80b-a3b-thinking', name: 'qwen3-next-80b-a3b-thinking', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Next 80B', requiresImage: false, options: {}},
  { id: 'qwen-vl-max-latest', name: 'qwen-vl-max-latest', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Max latest', requiresImage: false, options: {}},
  { id: 'qwen3.5-27b', name: 'qwen3.5-27b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen 3.5 27B', requiresImage: false, options: {}},
  { id: 'qwen3-vl-flash', name: 'qwen3-vl-flash', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo VL Flash', requiresImage: false, options: {}},
  { id: 'qwen-turbo-latest', name: 'qwen-turbo-latest', category: 'llm', type: 'sync', quota: { remaining: 999964, total: 1000000 }, description: 'Modelo Turbo latest', requiresImage: false, options: {}},
  { id: 'qwen3-14b', name: 'qwen3-14b', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Qwen 3 14B', requiresImage: false, options: {}},
  { id: 'qwen2.5-32b-instruct', name: 'qwen2.5-32b-instruct', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo 32B', requiresImage: false, options: {}},
  { id: 'qwen3-max-2025-09-23', name: 'qwen3-max-2025-09-23', category: 'llm', type: 'sync', quota: { remaining: 1000000, total: 1000000 }, description: 'Modelo Max actualizado', requiresImage: false, options: {}},
];

export function getModelsByCategory(category: ModelCategory): Model[] {
  return MODELS.filter(m => m.category === category);
}

export function getModelById(id: string): Model | undefined {
  return MODELS.find(m => m.id === id);
}

export function getCategoryCounts(): Record<ModelCategory, number> {
  const counts: Record<ModelCategory, number> = {} as Record<ModelCategory, number>;
  for (const category of Object.keys(CATEGORIES) as ModelCategory[]) {
    counts[category] = getModelsByCategory(category).length;
  }
  return counts;
}