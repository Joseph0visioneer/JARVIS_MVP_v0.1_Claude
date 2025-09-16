'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Calendar, FileText, Share2, TrendingUp, Users, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import MeetingHistory from '@/components/meeting/MeetingHistory'
import PersonalInsights from '@/components/analytics/PersonalInsights'

// 데모용 데이터
const dashboardData = {
  stats: {
    totalMeetings: 24,
    thisMonthMeetings: 8,
    totalProjects: 5,
    totalParticipants: 12
  },
  recentMeetings: [
    {
      id: '1',
      title: '제품 기획 미팅 - 새로운 기능 논의',
      date: '2024-01-15',
      participants: 4,
      sentiment: 'positive'
    },
    {
      id: '2',
      title: '개발팀 스프린트 리뷰',
      date: '2024-01-12',
      participants: 6,
      sentiment: 'neutral'
    },
    {
      id: '3',
      title: '마케팅 전략 회의',
      date: '2024-01-10',
      participants: 3,
      sentiment: 'positive'
    }
  ],
  topKeywords: [
    { keyword: '개발', frequency: 15, category: 'Technology' },
    { keyword: '사용자경험', frequency: 12, category: 'Design' },
    { keyword: '마케팅', frequency: 10, category: 'Business' },
    { keyword: '성능개선', frequency: 8, category: 'Technology' },
    { keyword: '데이터분석', frequency: 7, category: 'Analytics' }
  ],
  insights: [
    "이번 달 미팅에서 '사용자 경험' 키워드가 40% 증가했습니다.",
    "개발 관련 논의가 전체 미팅의 60%를 차지하고 있습니다.",
    "평균 미팅 참석자 수가 4.2명으로 적정 수준을 유지하고 있습니다."
  ],
  projects: [
    { name: '사용자 대시보드 개선', meetings: 8, lastActivity: '2024-01-15' },
    { name: '모바일 앱 개발', meetings: 6, lastActivity: '2024-01-12' },
    { name: '마케팅 캠페인', meetings: 4, lastActivity: '2024-01-10' },
    { name: '성능 최적화', meetings: 3, lastActivity: '2024-01-08' },
    { name: 'API 리팩토링', meetings: 3, lastActivity: '2024-01-05' }
  ]
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '😊'
    case 'negative':
      return '😟'
    default:
      return '😐'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Technology':
      return 'bg-blue-100 text-blue-800'
    case 'Design':
      return 'bg-purple-100 text-purple-800'
    case 'Business':
      return 'bg-green-100 text-green-800'
    case 'Analytics':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function DashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const { stats, recentMeetings, topKeywords, insights, projects } = dashboardData

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleViewMeeting = (meeting: any) => {
    // 미팅 상세 보기 로직
    console.log('View meeting:', meeting)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

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
              <span className="ml-2 text-sm text-gray-500">대시보드</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">안녕하세요, {user?.name}님!</span>
              <Link href="/analyze">
                <Button>새 미팅 분석</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                대시보드
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                미팅 기록
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                개인 인사이트
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요, {user?.name}님! 👋</h2>
              <p className="text-gray-600">
                JARVIS 대시보드에서 미팅 분석 현황을 확인해보세요.
              </p>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 미팅 수</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">이번 달</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">프로젝트 수</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">참여자 수</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  최근 미팅
                </CardTitle>
                <CardDescription>
                  최근 분석한 미팅 목록입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{new Date(meeting.date).toLocaleDateString('ko-KR')}</span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {meeting.participants}명
                          </span>
                          <span>{getSentimentIcon(meeting.sentiment)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  프로젝트 현황
                </CardTitle>
                <CardDescription>
                  프로젝트별 미팅 활동 현황입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-500">
                          {project.meetings}개 미팅 • 마지막 활동: {new Date(project.lastActivity).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(project.meetings * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Top Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🏷️ 인기 키워드
                </CardTitle>
                <CardDescription>
                  자주 언급되는 키워드들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topKeywords.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{item.keyword}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{item.frequency}회</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  AI 인사이트
                </CardTitle>
                <CardDescription>
                  미팅 데이터 기반 분석 결과입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 액션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/analyze">
                  <Button className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    새 미팅 분석하기
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  최근 결과 공유하기
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  상세 리포트 보기
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </>
        )}

        {activeTab === 'history' && user && (
          <MeetingHistory
            userId={user.id}
            onViewMeeting={handleViewMeeting}
          />
        )}

        {activeTab === 'insights' && user && (
          <PersonalInsights userId={user.id} />
        )}
      </main>
    </div>
  )
}