'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Search, Trash2, Share2, Eye, Filter } from 'lucide-react'

interface SavedMeeting {
  id: string
  title: string
  summary: string
  createdAt: string
  sentiment: 'positive' | 'neutral' | 'negative'
  participantCount: number
  keywords: string[]
}

interface MeetingHistoryProps {
  userId: string
  onViewMeeting: (meeting: SavedMeeting) => void
}

export default function MeetingHistory({ userId, onViewMeeting }: MeetingHistoryProps) {
  const [meetings, setMeetings] = useState<SavedMeeting[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<SavedMeeting[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')

  useEffect(() => {
    loadMeetings()
  }, [userId])

  useEffect(() => {
    filterMeetings()
  }, [meetings, searchTerm, sentimentFilter])

  const loadMeetings = () => {
    if (typeof window !== 'undefined') {
      const savedMeetings = localStorage.getItem(`jarvis-meetings-${userId}`)
      if (savedMeetings) {
        try {
          const meetings = JSON.parse(savedMeetings)
          setMeetings(meetings)
        } catch (error) {
          console.error('Failed to load meetings:', error)
        }
      }
    }
  }

  const filterMeetings = () => {
    let filtered = meetings

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // 감정 필터링
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.sentiment === sentimentFilter)
    }

    setFilteredMeetings(filtered)
  }

  const deleteMeeting = (meetingId: string) => {
    const updatedMeetings = meetings.filter(m => m.id !== meetingId)
    setMeetings(updatedMeetings)

    if (typeof window !== 'undefined') {
      localStorage.setItem(`jarvis-meetings-${userId}`, JSON.stringify(updatedMeetings))
    }
  }

  const shareMeeting = (meeting: SavedMeeting) => {
    const shareUrl = `${window.location.origin}/share/demo-${meeting.id}`
    const shareText = `${meeting.title} - JARVIS 미팅 분석 결과`

    if (navigator.share) {
      navigator.share({
        title: meeting.title,
        text: shareText,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      alert('공유 링크가 클립보드에 복사되었습니다!')
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😟'
      default: return '😐'
    }
  }

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '긍정적'
      case 'negative': return '부정적'
      default: return '중립'
    }
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            미팅 검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="미팅 제목, 내용, 키워드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">모든 감정</option>
                <option value="positive">긍정적</option>
                <option value="neutral">중립</option>
                <option value="negative">부정적</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미팅 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              저장된 미팅 ({filteredMeetings.length}개)
            </span>
          </CardTitle>
          <CardDescription>
            분석한 미팅 기록을 관리하고 다시 확인할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {meetings.length === 0 ? '저장된 미팅이 없습니다' : '검색 조건에 맞는 미팅이 없습니다'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{meeting.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {meeting.summary}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(meeting.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span>{getSentimentIcon(meeting.sentiment)} {getSentimentText(meeting.sentiment)}</span>
                        <span>{meeting.participantCount}명 참석</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meeting.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                        {meeting.keywords.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{meeting.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewMeeting(meeting)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareMeeting(meeting)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMeeting(meeting.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}