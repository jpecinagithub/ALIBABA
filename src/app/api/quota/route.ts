import { NextRequest, NextResponse } from 'next/server';
import { getAllQuotas, getRemainingQuota } from '@/lib/quota';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const modelId = searchParams.get('modelId');
  
  if (modelId) {
    const quota = getRemainingQuota(modelId);
    return NextResponse.json({ modelId, remaining: quota });
  }
  
  const quotas = getAllQuotas();
  return NextResponse.json(quotas);
}