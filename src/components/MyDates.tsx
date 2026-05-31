'use client'
import { DATES, Status } from '@/lib/constants'
import { VoteMap } from './Dashboard'

const STATUS_CYCLE: Status[] = [null, 'available', 'unavailable']
const STATUS_STYLE: Record<string, { bg: string; border: string; label: string; textColor: string }> = {
  available:   { bg: '#14532d', border: '#22c55e', label: '✓ Yes',  textColor: '#86efac' },
  unavailable: { bg: '#450a0a', border: '#ef4444', label: '✗ No',   textColor: '#fca5a5' },
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return {
    day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('en-GB', { month: 'short' }),
  }
}

function groupIntoWeekends(dates: string[]) {
  const groups: string[][] = []
  let current: string[] = []
  dates.forEach(d => {
    const day = new Date(d + 'T00:00:00').getDay()
    if (day === 5 && current.length > 0) { groups.push(current); current = [] }
    current.push(d)
  })
  if (current.length > 0) groups.push(current)
  return groups
}

export default function MyDates({ currentUser, votes, onVote }: { currentUser: string; votes: VoteMap; onVote: (date: string, status: Status) => void }) {
  const weekends = groupIntoWeekends(DATES)
  const myVotes = votes[currentUser] || {}
  const answered = Object.values(myVotes).filter(Boolean).length

  function handleTap(date: string) {
    const current = myVotes[date] ?? null
    const idx = STATUS_CYCLE.indexOf(current)
    onVote(date, STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length])
  }

  return (
    <div className="relative z-10 px-4 pt-5 max-w-lg mx-auto">
      <p className="text-white/40 text-xs mb-3">Tap to toggle: <span className="text-green-400 font-bold">Yes</span> → <span className="text-red-400 font-bold">No</span></p>
      <div className="mb-4 bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${DATES.length > 0 ? (answered / DATES.length) * 100 : 0}%` }} />
      </div>
      <p className="text-white/30 text-xs mb-5 -mt-2">{answered}/{DATES.length} dates answered</p>
      <div className="space-y-4">
        {weekends.map((weekend, wi) => {
          const fri = new Date(weekend[0] + 'T00:00:00')
          const sun = new Date(weekend[weekend.length - 1] + 'T00:00:00')
          return (
            <div key={wi}>
              <p className="text-white/35 text-xs font-bold uppercase tracking-widest mb-2">
                {fri.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {sun.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {weekend.map(dateStr => {
                  const { day, date, month } = formatDate(dateStr)
                  const status = myVotes[dateStr] ?? null
                  const s = status ? STATUS_STYLE[status] : null
                  return (
                    <button key={dateStr} onClick={() => handleTap(dateStr)}
                      className="rounded-2xl py-4 flex flex-col items-center gap-0.5 border transition-all active:scale-95"
                      style={s
                        ? { background: s.bg, borderColor: s.border }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-50">{day}</span>
                      <span className="text-3xl font-black leading-none">{date}</span>
                      <span className="text-xs opacity-50 uppercase tracking-wide">{month}</span>
                      <span className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full"
                        style={s
                          ? { color: s.textColor, background: 'rgba(0,0,0,0.25)' }
                          : { color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' }}>
                        {s ? s.label : 'Tap'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
