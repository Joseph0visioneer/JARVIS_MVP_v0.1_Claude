'use client'

import React, { useState } from 'react'
import MeetingUpload from '@/components/meeting/MeetingUpload'
import MeetingAnalysisView from '@/components/meeting/MeetingAnalysisView'

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result)
  }

  const handleBack = () => {
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <a href="/" className="hover:text-blue-600">JARVIS</a>
              </h1>
              <span className="ml-2 text-sm text-gray-500">미팅 분석</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                홈으로
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                미팅 분석하기
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                미팅 녹취록이나 텍스트를 업로드하면 AI가 자동으로 분석하여
                핵심 포인트와 액션 아이템을 정리해드립니다.
              </p>
            </div>

            <MeetingUpload onAnalysisComplete={handleAnalysisComplete} />

            {/* 샘플 텍스트 */}
            <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
              <p className="mb-2">🔒 업로드된 파일은 분석 후 즉시 삭제되며, 개인정보는 안전하게 보호됩니다.</p>
              <p>💡 <strong>팁:</strong> 더 정확한 분석을 위해 참석자 이름과 주요 안건을 포함해 주세요.</p>
            </div>
          </div>
        ) : (
          <MeetingAnalysisView
            result={analysisResult}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}