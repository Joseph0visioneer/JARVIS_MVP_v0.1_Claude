'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Users, Clock, MessageSquare, Lightbulb } from 'lucide-react'

interface PersonalInsightsProps {
  userId: string
}

interface InsightData {
  totalMeetings: number
  totalHours: number
  averageParticipants: number
  mostActiveDay: string
  topKeywords: Array<{ keyword: string; frequency: number }>
  sentimentTrend: Array<{ date: string; sentiment: string }>
  productivityScore: number
  recommendations: string[]
}

export default function PersonalInsights({ userId }: PersonalInsightsProps) {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generatePersonalInsights()
  }, [userId])

  const generatePersonalInsights = () => {
    if (typeof window === 'undefined') return

    try {
      const meetings = JSON.parse(localStorage.getItem(`jarvis-meetings-${userId}`) || '[]')

      if (meetings.length === 0) {
        setInsights(null)
        setIsLoading(false)
        return
      }

      // 기본 통계 계산
      const totalMeetings = meetings.length
      const totalHours = meetings.length * 1.5 // 가상의 미팅 시간
      const averageParticipants = meetings.reduce((sum: number, m: any) => sum + m.participantCount, 0) / meetings.length

      // 요일별 미팅 분석
      const dayCount: { [key: string]: number } = {}
      meetings.forEach((meeting: any) => {
        const day = new Date(meeting.createdAt).toLocaleDateString('ko-KR', { weekday: 'long' })
        dayCount[day] = (dayCount[day] || 0) + 1
      })
      const mostActiveDay = Object.entries(dayCount).sort(([,a], [,b]) => b - a)[0]?.[0] || '월요일'

      // 키워드 빈도 분석
      const keywordCount: { [key: string]: number } = {}
      meetings.forEach((meeting: any) => {
        meeting.keywords.forEach((keyword: string) => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1
        })
      })
      const topKeywords = Object.entries(keywordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([keyword, frequency]) => ({ keyword, frequency }))

      // 감정 트렌드
      const sentimentTrend = meetings.slice(-7).map((meeting: any) => ({
        date: meeting.createdAt,
        sentiment: meeting.sentiment
      }))

      // 생산성 점수 (가상의 계산)
      const positiveCount = meetings.filter((m: any) => m.sentiment === 'positive').length
      const productivityScore = Math.round((positiveCount / totalMeetings) * 100)

      // 개인화된 추천사항 생성
      const recommendations = generateRecommendations(meetings, topKeywords, productivityScore)

      setInsights({
        totalMeetings,
        totalHours,
        averageParticipants,
        mostActiveDay,
        topKeywords,
        sentimentTrend,
        productivityScore,
        recommendations
      })
    } catch (error) {
      console.error('Failed to generate insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecommendations = (meetings: any[], topKeywords: any[], productivityScore: number): string[] => {
    const recommendations: string[] = []

    // 미팅 빈도 기반 추천
    if (meetings.length < 5) {
      recommendations.push('더 많은 미팅을 분석하여 개인 맞춤형 인사이트를 받아보세요.')
    }

    // 생산성 점수 기반 추천
    if (productivityScore < 60) {
      recommendations.push('미팅의 긍정적인 결과를 높이기 위해 사전 준비와 명확한 목표 설정을 권장합니다.')
    } else if (productivityScore > 80) {
      recommendations.push('높은 미팅 만족도를 유지하고 계시네요! 이 패턴을 다른 팀원들과 공유해보세요.')
    }

    // 키워드 기반 추천
    if (topKeywords.some(k => k.keyword.includes('개발'))) {
      recommendations.push('개발 관련 논의가 많습니다. 기술 문서화와 진행 상황 추적을 강화해보세요.')
    }

    if (topKeywords.some(k => k.keyword.includes('마케팅'))) {
      recommendations.push('마케팅 전략 논의가 활발합니다. 시장 데이터와 KPI 추적을 체계화해보세요.')
    }

    // 기본 추천사항
    if (recommendations.length === 0) {
      recommendations.push('정기적인 회고를 통해 미팅의 효율성을 더욱 높여보세요.')
    }

    return recommendations
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">아직 인사이트가 없습니다</h3>
        <p className="text-gray-500">
          미팅을 분석하면 개인 맞춤형 인사이트가 생성됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">개인 인사이트</h2>
        <p className="text-gray-600">
          미팅 데이터를 기반으로 한 개인 맞춤형 분석 결과입니다.
        </p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 미팅 수</p>
                <p className="text-2xl font-bold text-gray-900">{insights.totalMeetings}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">누적 시간</p>
                <p className="text-2xl font-bold text-gray-900">{insights.totalHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 참석자</p>
                <p className="text-2xl font-bold text-gray-900">{insights.averageParticipants.toFixed(1)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">생산성 점수</p>
                <p className="text-2xl font-bold text-gray-900">{insights.productivityScore}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 활동 패턴 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              활동 패턴
            </CardTitle>
            <CardDescription>
              미팅 활동의 주요 패턴을 분석합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">가장 활발한 요일</span>
                <span className="font-medium">{insights.mostActiveDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 미팅 길이</span>
                <span className="font-medium">1.5시간</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">최근 7일 활동</span>
                <div className="flex space-x-1">
                  {insights.sentimentTrend.map((item, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-green-500' :
                        item.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      title={new Date(item.date).toLocaleDateString('ko-KR')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 주요 키워드 */}
        <Card>
          <CardHeader>
            <CardTitle>자주 다루는 주제</CardTitle>
            <CardDescription>
              미팅에서 자주 언급되는 키워드입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topKeywords.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(item.frequency / insights.topKeywords[0].frequency) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{item.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI 추천사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI 추천사항
          </CardTitle>
          <CardDescription>
            데이터 분석을 기반으로 한 개인 맞춤형 추천입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}