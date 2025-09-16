'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Copy, ArrowLeft, CheckCircle, Clock, User } from 'lucide-react'

interface AnalysisResult {
  summary: string
  keyPoints: string[]
  actionItems: Array<{
    task: string
    assignee?: string
    deadline?: string
  }>
  participants: string[]
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  nextSteps: string
  shareableText: string
}

interface MeetingAnalysisViewProps {
  result: {
    success: boolean
    meetingId: string
    title: string
    analysis: AnalysisResult
    createdAt: string
  }
  onBack: () => void
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

export default function MeetingAnalysisView({ result, onBack }: MeetingAnalysisViewProps) {
  const { title, analysis, createdAt } = result

  // 분석 결과를 로컬스토리지에 저장
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('jarvis-user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          const storageKey = `jarvis-meetings-${userData.id}`
          const existingMeetings = JSON.parse(localStorage.getItem(storageKey) || '[]')

          const meetingData = {
            id: result.meetingId,
            title,
            summary: analysis.summary,
            createdAt,
            sentiment: analysis.sentiment,
            participantCount: analysis.participants.length,
            keywords: analysis.keywords
          }

          // 중복 확인
          const exists = existingMeetings.some((m: any) => m.id === result.meetingId)
          if (!exists) {
            const updatedMeetings = [meetingData, ...existingMeetings]
            localStorage.setItem(storageKey, JSON.stringify(updatedMeetings))
          }
        } catch (error) {
          console.error('Failed to save meeting:', error)
        }
      }
    }
  }, [result, title, analysis, createdAt])

  const handleShare = async () => {
    // 데모용 공유 토큰 생성 (실제로는 서버에서 생성)
    const shareToken = `demo-${result.meetingId}`
    const shareUrl = `${window.location.origin}/share/${shareToken}`
    const shareText = `${analysis.shareableText}\n\n미팅 분석 결과: ${shareUrl}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.log('공유 취소됨')
      }
    } else {
      // 클립보드에 복사
      await navigator.clipboard.writeText(shareText)
      alert('공유 링크가 클립보드에 복사되었습니다!\n\n' + shareText)
    }
  }

  const handleCopy = async () => {
    const copyText = `${title}\n\n${analysis.summary}\n\n주요 키워드: ${analysis.keywords.join(', ')}`
    await navigator.clipboard.writeText(copyText)
    alert('분석 결과가 클립보드에 복사되었습니다!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            복사
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            공유
          </Button>
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
              {analysis.actionItems.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  구체적인 액션 아이템이 없습니다.
                </p>
              )}
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
      {analysis.participants.length > 0 && (
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
      )}

      {/* 다시 분석하기 버튼 */}
      <div className="text-center">
        <Button variant="outline" onClick={onBack} size="lg">
          새 미팅 분석하기
        </Button>
      </div>
    </div>
  )
}