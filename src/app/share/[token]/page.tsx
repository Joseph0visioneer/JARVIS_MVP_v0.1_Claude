import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SharePageProps {
  params: Promise<{
    token: string
  }>
}

// 데모용 데이터 (실제로는 데이터베이스에서 가져와야 함)
const getDemoMeetingData = (token: string) => {
  return {
    title: "제품 기획 미팅 - 새로운 기능 논의",
    analysis: {
      summary: "새로운 사용자 대시보드 기능에 대한 기획 미팅을 진행했습니다. 사용자 경험 개선과 데이터 시각화 방안을 중점적으로 논의했으며, 개발 일정과 우선순위를 결정했습니다.",
      keyPoints: [
        "사용자 대시보드 UI/UX 개선 방안 논의",
        "데이터 시각화 라이브러리 선정 (Chart.js vs D3.js)",
        "모바일 반응형 디자인 우선 적용",
        "사용자 피드백 수집을 위한 베타 테스트 계획"
      ],
      actionItems: [
        {
          task: "UI 목업 및 와이어프레임 제작",
          assignee: "김디자인",
          deadline: "2024년 1월 25일"
        },
        {
          task: "기술 스택 조사 및 비교 분석",
          assignee: "박개발",
          deadline: "2024년 1월 22일"
        },
        {
          task: "베타 테스터 모집 및 일정 조율",
          assignee: "이기획",
          deadline: "2024년 1월 30일"
        }
      ],
      participants: ["김기획", "박개발", "이디자인", "최마케팅"],
      keywords: ["대시보드", "UI/UX", "데이터시각화", "모바일", "베타테스트"],
      sentiment: "positive" as const,
      nextSteps: "다음 주 화요일 오후 2시에 UI 목업 리뷰 미팅을 진행하고, 기술 스택 결정을 위한 추가 논의를 진행할 예정입니다.",
      shareableText: "제품 기획 미팅 완료! 사용자 대시보드 개선 방안을 논의했습니다."
    },
    createdAt: "2024-01-15T10:30:00Z"
  }
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-600 bg-green-100'
    case 'negative':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getSentimentText = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '긍정적'
    case 'negative':
      return '부정적'
    default:
      return '중립'
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params
  const meetingData = getDemoMeetingData(token)

  if (!meetingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">미팅을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">
              공유 링크가 잘못되었거나 만료되었을 수 있습니다.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { title, analysis, createdAt } = meetingData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <Link href="/" className="hover:text-blue-600">JARVIS</Link>
              </h1>
              <span className="ml-2 text-sm text-gray-500">공유된 미팅 분석</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/analyze" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                나도 분석해보기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}>
              {getSentimentText(analysis.sentiment)}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {analysis.participants.length}명 참석
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 요약 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              📋 미팅 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>

        {/* 핵심 포인트와 액션 아이템 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 핵심 포인트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                💡 핵심 포인트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 액션 아이템 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ✅ 액션 아이템
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.actionItems.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium text-gray-900">{item.task}</p>
                    {item.assignee && (
                      <p className="text-sm text-gray-600 mt-1">
                        <User className="h-3 w-3 inline mr-1" />
                        담당: {item.assignee}
                      </p>
                    )}
                    {item.deadline && (
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        마감: {item.deadline}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 키워드와 다음 단계 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 키워드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🏷️ 키워드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 다음 단계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🚀 다음 단계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{analysis.nextSteps}</p>
            </CardContent>
          </Card>
        </div>

        {/* 참석자 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              👥 참석자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.participants.map((participant, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                >
                  {participant}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl p-12 border">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            JARVIS로 미팅을 더 효율적으로!
          </h3>
          <p className="text-gray-600 mb-6">
            AI가 미팅을 자동으로 분석하고 핵심 포인트를 정리해드립니다.
          </p>
          <Link
            href="/analyze"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
          >
            무료로 시작하기
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 JARVIS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}