'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Loader2 } from 'lucide-react'

interface MeetingUploadProps {
  onAnalysisComplete: (result: any) => void
}

export default function MeetingUpload({ onAnalysisComplete }: MeetingUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [manualText, setManualText] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsAnalyzing(true)

    try {
      const text = await file.text()
      await analyzeContent(text, file.name)
    } catch (error) {
      console.error('파일 읽기 오류:', error)
      alert('파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const analyzeContent = async (content: string, title?: string) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title: title || '미팅 분석'
        }),
      })

      if (!response.ok) {
        throw new Error('분석 요청 실패')
      }

      const result = await response.json()
      onAnalysisComplete(result)
    } catch (error) {
      console.error('분석 오류:', error)
      alert('미팅 분석 중 오류가 발생했습니다.')
    }
  }

  const handleTextAnalysis = async () => {
    if (!manualText.trim()) {
      alert('분석할 텍스트를 입력해주세요.')
      return
    }

    setIsAnalyzing(true)
    try {
      await analyzeContent(manualText, '텍스트 미팅 분석')
      setManualText('')
      setShowTextInput(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/x-subrip': ['.srt'],
    },
    multiple: false,
  })

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">미팅 분석 중...</h3>
          <p className="text-gray-600 text-center">
            AI가 미팅 내용을 분석하고 있습니다. 잠시만 기다려주세요.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 파일 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            미팅 파일 업로드
          </CardTitle>
          <CardDescription>
            .txt, .md, .srt 파일을 드래그하거나 클릭하여 업로드하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">파일을 여기에 놓으세요...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  파일을 드래그하여 업로드하거나 클릭하세요
                </p>
                <p className="text-sm text-gray-500">
                  지원 형식: TXT, MD, SRT
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">또는</span>
        </div>
      </div>

      {/* 텍스트 직접 입력 */}
      <Card>
        <CardHeader>
          <CardTitle>텍스트 직접 입력</CardTitle>
          <CardDescription>
            미팅 내용을 직접 입력하여 분석할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showTextInput ? (
            <Button
              variant="outline"
              onClick={() => setShowTextInput(true)}
              className="w-full"
            >
              텍스트 입력하기
            </Button>
          ) : (
            <div className="space-y-4">
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="미팅 내용을 입력하세요..."
                className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleTextAnalysis}
                  disabled={!manualText.trim()}
                  className="flex-1"
                >
                  분석하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTextInput(false)
                    setManualText('')
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}