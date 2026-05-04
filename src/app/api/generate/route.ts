import { NextRequest, NextResponse } from 'next/server';
import { callDashScope } from '@/lib/dashscope';
import { getModelById } from '@/lib/models';
import { decrementQuota, getRemainingQuota } from '@/lib/quota';

export async function POST(request: NextRequest) {
  const apiKey = process.env.QWEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { modelId, prompt, image, size } = body as {
      modelId?: string;
      prompt?: string;
      image?: string;
      size?: string;
    };

    if (!modelId || !prompt) {
      return NextResponse.json(
        { error: 'Faltan parámetros: modelId y prompt son requeridos' },
        { status: 400 }
      );
    }

    const model = getModelById(modelId);
    if (!model) {
      return NextResponse.json(
        { error: 'Modelo no encontrado' },
        { status: 404 }
      );
    }

    const currentQuota = getRemainingQuota(modelId);
    if (currentQuota <= 0) {
      return NextResponse.json(
        { error: 'Cuota agotada para este modelo' },
        { status: 403 }
      );
    }

    const result = await callDashScope(apiKey, modelId, model.category, { prompt, image }, { size });

    if ('error' in result) {
      console.error(`[DashScope] ${modelId} →`, result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Text models (omni and llm)
    if ((model.category === 'omni' || model.category === 'llm') && 'output' in result && 'text' in result.output) {
      decrementQuota(modelId, 1);
      return NextResponse.json({ text: result.output.text });
    }

    // Image models (t2i and edit)
    if ('output' in result && 'results' in result.output && result.output.results[0]?.url) {
      decrementQuota(modelId, 1);
      return NextResponse.json({ url: result.output.results[0].url });
    }

    return NextResponse.json(
      { error: 'No se generó output' },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
