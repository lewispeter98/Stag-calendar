'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { DATES, NAMES, ORGANISER, Status } from '@/lib/constants'
import MyDates from './MyDates'
import Results from './Results'

export type VoteMap = Record<string, Record<string, Status>>

export default function Dashboard({ currentUser, onSignOut }: { currentUser: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<'my' | 'results'>('my')
  const [votes, setVotes] = useState<VoteMap>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadVotes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('votes').select('name, date, status')
    if (!error && data) {
      const map: VoteMap = {}
      data.forEach(({ name, date, status }) => {
        if (!map[name]) map[name] = {}
        map[name][date] = status as Status
      })
      setVotes(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadVotes() }, [loadVotes])

  async function handleVote(date: string, status: Status) {
    setSaving(true)
    setVotes(prev => ({
      ...prev,
      [currentUser]: { ...(prev[currentUser] || {}), [date]: status },
    }))
    if (status === null) {
      await supabase.from('votes').delete().eq('name', currentUser).eq('date', date)
    } else {
      await supabase.from('votes').upsert({ name: currentUser, date, status }, { onConflict: 'name,date' })
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-10">
      <div className="glow" />
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/7">
        <div className="flex items-center gap-2">
          <span className="text-xl">👑</span>
          <h1 className="font-black text-lg" style={{ background: 'linear-gradient(90deg,#c4b5fd,#f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Lewis's Stag Do
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-purple-400 text-xs animate-pulse">saving…</span>}
          <button onClick={onSignOut} className="bg-purple-500/15 border border-purple-500/40 rounded-full px-3 py-1.5 text-purple-300 text-xs font-bold">
            {currentUser} ▾
          </button>
        </div>
      </header>
      <div className="relative z-10 flex gap-2 px-5 pt-4">
        {(['my', 'results'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition-all ${tab === t ? 'bg-purple-500/20 border-purple-500/60 text-purple-300' : 'bg-transparent border-white/10 text-white/40'}`}>
            {t === 'my' ? '📅 My Dates' : '📊 Results'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      ) : tab === 'my' ? (
        <MyDates currentUser={currentUser} votes={votes} onVote={handleVote} />
      ) : (
        <Results votes={votes} />
      )}
    </div>
  )
}
