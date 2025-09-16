import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    task: string;
    assignee?: string;
    deadline?: string;
  }>;
  participants: string[];
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  nextSteps: string;
  shareableText: string;
}

const ANALYSIS_PROMPT = `
다음 미팅 내용을 분석하여 JSON 형태로 결과를 제공해주세요:

미팅 내용:
{content}

분석 결과를 다음 JSON 형태로 정확히 제공해주세요:

{
  "summary": "3-4줄 요약",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "actionItems": [
    {
      "task": "해야 할 일",
      "assignee": "담당자 (있을 경우)",
      "deadline": "마감일 (있을 경우)"
    }
  ],
  "participants": ["참석자1", "참석자2"],
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "sentiment": "positive|neutral|negative",
  "nextSteps": "다음 단계 제안",
  "shareableText": "SNS 공유용 간단 텍스트 (50자 내외)"
}

중요: 반드시 유효한 JSON 형태로만 응답해주세요. 다른 텍스트는 포함하지 마세요.
`;

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: '미팅 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const prompt = ANALYSIS_PROMPT.replace('{content}', content);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 미팅 분석 전문가입니다. 주어진 미팅 내용을 분석하여 정확한 JSON 형태로 결과를 제공해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysisText = completion.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('분석 결과를 받을 수 없습니다.');
    }

    // JSON 파싱 시도
    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('원본 응답:', analysisText);

      // 백업 분석 결과
      analysis = {
        summary: '미팅 분석을 완료했습니다. 상세 내용을 확인해 주세요.',
        keyPoints: ['미팅의 주요 내용이 논의되었습니다.'],
        actionItems: [{ task: '후속 조치 사항을 검토해 주세요.' }],
        participants: ['참석자'],
        keywords: ['미팅', '논의'],
        sentiment: 'neutral' as const,
        nextSteps: '다음 미팅 일정을 조율해 주세요.',
        shareableText: '미팅 분석 완료! 주요 내용을 확인해보세요.'
      };
    }

    // 미팅 ID 생성 (실제로는 데이터베이스에 저장해야 함)
    const meetingId = Date.now().toString();

    return NextResponse.json({
      success: true,
      meetingId,
      title: title || '미팅 분석 결과',
      analysis,
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('미팅 분석 오류:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '미팅 분석 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}