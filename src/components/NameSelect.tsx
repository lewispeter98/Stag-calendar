'use client'
import { useState } from 'react'
import { NAMES } from '@/lib/constants'

export default function NameSelect({ onSelect }: { onSelect: (name: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = NAMES.filter(n => n.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="glow" />
      <div className="relative z-10 max-w-lg mx-auto px-5 py-12 text-center">
        <div className="text-5xl mb-3">👑</div>
        <h1 className="text-5xl font-black leading-tight mb-3"
          style={{
            background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
          Lewis's<br />Stag Do
        </h1>
        <p className="text-white/40 text-lg mb-7">Who are you?</p>
        <input
          className="w-full max-w-xs mx-auto block px-4 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-white/30 outline-none focus:border-purple-500/60 mb-5 text-base"
          placeholder="Search your name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map(name => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="bg-white/4 border border-white/10 rounded-xl py-3 px-3 text-white font-semibold text-sm hover:bg-purple-500/20 hover:border-purple-500/40 active:scale-95 transition-all text-left"
            >
              {name}
            </button>
          ))}
        </div>
        <p className="text-white/25 text-xs mt-6">Tap your name to get started</p>
      </div>
    </div>
  )
}
