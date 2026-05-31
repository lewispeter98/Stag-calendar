'use client'
import { useState, useEffect } from 'react'
import NameSelect from '@/components/NameSelect'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('stag-user')
    if (saved) setCurrentUser(saved)
    setLoaded(true)
  }, [])

  function handleSelectName(name: string) {
    localStorage.setItem('stag-user', name)
    setCurrentUser(name)
  }

  function handleSignOut() {
    localStorage.removeItem('stag-user')
    setCurrentUser(null)
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
      </div>
    )
  }

  if (!currentUser) return <NameSelect onSelect={handleSelectName} />
  return <Dashboard currentUser={currentUser} onSignOut={handleSignOut} />
}
