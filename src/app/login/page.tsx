'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = (user: { email: string; name: string; id: string }) => {
    login(user)
    router.push('/dashboard')
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onToggleMode={toggleMode}
      isSignUp={isSignUp}
    />
  )
}