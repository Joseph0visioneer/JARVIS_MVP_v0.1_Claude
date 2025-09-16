'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('jarvis-user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Failed to parse saved user:', error)
          localStorage.removeItem('jarvis-user')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('jarvis-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('jarvis-user')
    localStorage.removeItem('jarvis-meetings')
  }

  return {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  }
}