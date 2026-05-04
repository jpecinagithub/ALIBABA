import type { ModelCategory } from './models';

export const DASHSCOPE_CONFIG = {
  baseUrl: 'https://dashscope-intl.aliyuncs.com',
  endpoints: {
    multimodalGeneration: '/api/v1/services/aigc/multimodal-generation/generation',
    textGeneration: '/api/v1/services/aigc/text-generation/generation',
  },
} as const;

interface DashScopeInput {
  prompt?: string;
  image?: string;
}

interface DashScopeOptions {
  size?: string;
  n?: number;
}

type DashScopeResult =
  | { error: string }
  | { output: { results: { url: string }[] } }
  | { output: { text: string } };

// VL (Vision-Language) and QVQ models use multimodal-generation endpoint
// even though they are in the 'llm' category, because they require array content format.
function isVisualModel(modelId: string): boolean {
  return modelId.includes('-vl-') || modelId.startsWith('qvq');
}

function formatSizeHelper(size?: string): string | undefined {
  if (!size) return undefined;
  return size.replace(/x/g, '*');
}

function createError(message: string): { error: string } {
  return { error: message };
}

function createOutput(imageUrl: string) {
  return { output: { results: [{ url: imageUrl }] } };
}

function createTextOutput(text: string) {
  return { output: { text } };
}

// DashScope returns content as a plain string for pure LLM models, but as
// [{text: "..."}] for VL/omni/multimodal models — handle both.
function extractText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((c: unknown) =>
        typeof c === 'object' && c !== null && 'text' in c
          ? String((c as { text: unknown }).text)
          : ''
      )
      .join('');
  }
  return '';
}

async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { response, data };
}

export async function callDashScope(
  apiKey: string,
  model: string,
  modelCategory: ModelCategory,
  input: DashScopeInput,
  options: DashScopeOptions
): Promise<DashScopeResult> {
  const headers: Record<string, string> = {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  };
  const base = DASHSCOPE_CONFIG.baseUrl;

  // ── Pure text LLM models ──────────────────────────────────────────────────
  // Endpoint: text-generation. Content is a plain string. Response is a string.
  // DashScope has two response formats depending on model vintage:
  //   - New (chat): output.choices[0].message.content
  //   - Old:        output.text
  if (modelCategory === 'llm' && !isVisualModel(model)) {
    const body = {
      model,
      input: { messages: [{ role: 'user', content: input.prompt || 'Hello' }] },
    };
    try {
      const { response, data } = await postJson(base + DASHSCOPE_CONFIG.endpoints.textGeneration, headers, body);
      if (!response.ok) return createError(data.message || data.error_message || 'API error: ' + response.status);
      const raw = data.output?.choices?.[0]?.message?.content ?? data.output?.text;
      const text = extractText(raw);
      return text ? createTextOutput(text) : createError('No output generated');
    } catch (error) {
      return createError('Request failed: ' + error);
    }
  }

  // ── Omni models ───────────────────────────────────────────────────────────
  // Endpoint: multimodal-generation. Content as array, text response.
  if (modelCategory === 'omni') {
    const content: Array<{ text?: string; image?: string }> = [];
    if (input.prompt) content.push({ text: input.prompt });
    if (input.image) content.push({ image: input.image });
    const body = {
      model,
      input: {
        messages: [{ role: 'user', content: content.length > 0 ? content : [{ text: 'Hello' }] }],
      },
    };
    try {
      const { response, data } = await postJson(base + DASHSCOPE_CONFIG.endpoints.multimodalGeneration, headers, body);
      if (!response.ok) return createError(data.message || data.error_message || 'API error: ' + response.status);
      const text = extractText(data.output?.choices?.[0]?.message?.content);
      return text ? createTextOutput(text) : createError('No output generated');
    } catch (error) {
      return createError('Request failed: ' + error);
    }
  }

  // ── VL / QVQ models ───────────────────────────────────────────────────────
  // Endpoint: multimodal-generation. Content is an array. Response is text (array).
  if (isVisualModel(model)) {
    const content: Array<{ text?: string; image?: string }> = [];
    if (input.prompt) content.push({ text: input.prompt });
    if (input.image) content.push({ image: input.image });
    const body = {
      model,
      input: {
        messages: [{ role: 'user', content: content.length > 0 ? content : [{ text: 'Hello' }] }],
      },
    };
    try {
      const { response, data } = await postJson(base + DASHSCOPE_CONFIG.endpoints.multimodalGeneration, headers, body);
      if (!response.ok) return createError(data.message || data.error_message || 'API error: ' + response.status);
      const text = extractText(data.output?.choices?.[0]?.message?.content);
      return text ? createTextOutput(text) : createError('No output generated');
    } catch (error) {
      return createError('Request failed: ' + error);
    }
  }

  // ── Image models (t2i / edit) ─────────────────────────────────────────────
  // Endpoint: multimodal-generation. Content is an array. Response contains image URL.
  const imageContent: Array<{ text?: string; image?: string }> = [];
  if (input.prompt) imageContent.push({ text: input.prompt });
  if (input.image) imageContent.push({ image: input.image });
  const body = {
    model,
    input: {
      messages: [{
        role: 'user',
        content: imageContent.length > 0 ? imageContent : [{ text: '' }],
      }],
    },
    parameters: {
      size: formatSizeHelper(options.size),
      n: options.n,
    },
  };
  try {
    const { response, data } = await postJson(base + DASHSCOPE_CONFIG.endpoints.multimodalGeneration, headers, body);
    if (!response.ok) return createError(data.message || data.error_message || 'API error: ' + response.status);
    const results: unknown = data.output?.choices?.[0]?.message?.content;
    if (Array.isArray(results) && results.length > 0) {
      const imageUrl = (results[0] as { image?: string }).image;
      if (imageUrl) return createOutput(imageUrl);
    }
    return createError('No output generated');
  } catch (error) {
    return createError('Request failed: ' + error);
  }
}
