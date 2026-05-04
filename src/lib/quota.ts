import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'quota-data.json');

interface QuotaData {
  [modelId: string]: number;
}

function loadQuotas(): QuotaData {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load quota data:', e);
  }
  return {};
}

function saveQuotas(quotas: QuotaData) {
  writeFileSync(DATA_FILE, JSON.stringify(quotas, null, 2));
}

const INITIAL_QUOTAS: QuotaData = {
  // Image models
  'qwen-image': 100,
  'qwen-image-2.0': 96,
  'qwen-image-max': 100,
  'qwen-image-plus': 100,
  'qwen-image-2.0-pro': 100,
  'qwen-image-max-2025-12-30': 100,
  'qwen-image-2.0-2026-03-03': 100,
  'qwen-image-2.0-pro-2026-03-03': 100,
  'qwen-image-plus-2026-01-09': 100,
  'z-image-turbo': 100,
  // Edit models
  'qwen-image-edit': 100,
  'qwen-image-edit-plus': 100,
  'qwen-image-edit-max': 100,
  'qwen-image-edit-plus-2025-10-30': 100,
  'qwen-image-edit-max-2026-01-16': 100,
  'qwen-image-edit-plus-2025-12-15': 100,
  // Omni models
  'qwen3.5-omni-plus': 1000000,
  'qwen3.5-omni-plus-2026-03-15': 1000000,
  'qwen3.5-omni-flash': 1000000,
  'qwen3.5-omni-flash-2026-03-15': 1000000,
  'qwen3.5-omni-plus-realtime': 1000000,
  'qwen3.5-omni-plus-realtime-2026-03-15': 1000000,
  'qwen3.5-omni-flash-realtime': 1000000,
  'qwen3.5-omni-flash-realtime-2026-03-15': 1000000,
  'qwen3-omni-flash': 1000000,
  'qwen3-omni-flash-2025-09-15': 1000000,
  'qwen3-omni-flash-realtime': 1000000,
  'qwen3-omni-flash-realtime-2025-09-15': 1000000,
  'qwen-omni-turbo': 1000000,
  'qwen-omni-turbo-realtime': 1000000,
  'qwen-omni-turbo-realtime-2025-05-08': 1000000,
  'qwen-omni-turbo-2025-03-26': 1000000,
  'qwen2.5-omni-7b': 1000000,
  // LLM models
  'qwen-max-2025-03-25': 1000000,
  'qwen3-vl-235b-a22b-thinking': 1000000,
  'qwen2.5-vl-72b-instruct': 1000000,
  'qwen-vl-plus-2025-05-07': 1000000,
  'qwen-plus-2025-07-28': 1000000,
  'qwen-vl-plus-latest': 1000000,
  'qwen2.5-vl-3b-instruct': 1000000,
  'qwen-max': 723311,
  'qwen2.5-14b-instruct': 1000000,
  'qwen-mt-flash': 1000000,
  'qwen3-vl-30b-a3b-thinking': 1000000,
  'qwen3.6-plus': 991953,
  'qwen3-32b': 1000000,
  'qwen2.5-7b-instruct': 1000000,
  'qwen-vl-max-2025-08-13': 1000000,
  'qwen-vl-plus': 1000000,
  'qwen3.5-35b-a3b': 1000000,
  'qwen-max-2025-01-25': 1000000,
  'qwen3-coder-480b-a35b-instruct': 1000000,
  'qwen3-coder-plus': 1000000,
  'qwen3-vl-8b-thinking': 1000000,
  'qwen3-max-preview': 1000000,
  'qwen3.5-flash-2026-02-23': 1000000,
  'qwen3-vl-flash-2025-10-15': 1000000,
  'qwen3-8b': 1000000,
  'qwen2.5-14b-instruct-1m': 1000000,
  'qwen-turbo': 999931,
  'qwen3-0.6b': 1000000,
  'qwen3-coder-flash': 1000000,
  'qwen-vl-plus-2025-08-15': 1000000,
  'qwen3-next-80b-a3b-thinking': 1000000,
  'qwen-vl-max-latest': 1000000,
  'qwen3.5-27b': 1000000,
  'qwen3-vl-flash': 1000000,
  'qwen-turbo-latest': 999964,
  'qwen3-14b': 1000000,
  'qwen2.5-32b-instruct': 1000000,
  'qwen3-max-2025-09-23': 1000000,
};

export function getRemainingQuota(modelId: string): number {
  const quotas = loadQuotas();
  if (quotas[modelId] !== undefined) {
    return quotas[modelId];
  }
  if (INITIAL_QUOTAS[modelId] !== undefined) {
    return INITIAL_QUOTAS[modelId];
  }
  return 0;
}

export function decrementQuota(modelId: string, amount: number = 1): number {
  const quotas = loadQuotas();
  
  let current = quotas[modelId];
  if (current === undefined) {
    current = INITIAL_QUOTAS[modelId] || 0;
  }
  
  const newValue = Math.max(0, current - amount);
  quotas[modelId] = newValue;
  saveQuotas(quotas);
  
  return newValue;
}

export function getAllQuotas(): QuotaData {
  const quotas = loadQuotas();
  const result: QuotaData = {};
  
  for (const modelId of Object.keys(INITIAL_QUOTAS)) {
    result[modelId] = quotas[modelId] !== undefined ? quotas[modelId] : INITIAL_QUOTAS[modelId];
  }
  
  return result;
}

export function resetQuotas() {
  saveQuotas({});
}