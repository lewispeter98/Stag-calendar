'use client'
import { DATES, NAMES, ORGANISER } from '@/lib/constants'
import { VoteMap } from './Dashboard'

const SCOREABLE = NAMES.filter(n => n !== ORGANISER)

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

export default function Results({ votes }: { votes: VoteMap }) {
  const organiserVotes = votes[ORGANISER] || {}
  const visibleDates = DATES.filter(d => organiserVotes[d] !== 'unavailable')

  function scoreDate(dateStr: string) {
    let yes = 0, no = 0
    SCOREABLE.forEach(name => {
      const s = votes[name]?.[dateStr]
      if (s === 'available') yes++
      else if (s === 'unavailable') no++
    })
    return { yes, no }
  }

  const weekends = groupIntoWeekends(visibleDates)
  const ranked = weekends
    .map(wknd => ({
      dates: wknd,
      totalYes: wknd.reduce((s, d) => s + scoreDate(d).yes, 0),
    }))
    .sort((a, b) => b.totalYes - a.totalYes)

  const responded = NAMES.filter(n => votes[n] && Object.keys(votes[n]).length > 0)
  const n = SCOREABLE.length

  return (
    <div className="relative z-10 px-4 pt-5 max-w-lg mx-auto">
      <p className="text-white/40 text-xs mb-5">Ranked by who can make it. {ORGANISER}'s unavailable dates are hidden.</p>
      <div className="space-y-3 mb-8">
        {ranked.map(({ dates, totalYes }, wi) => {
          const isTop = wi === 0
          const fri = new Date(dates[0] + 'T00:00:00')
          const last = new Date(dates[dates.length - 1] + 'T00:00:00')
          return (
            <div key={wi} className="rounded-2xl border p-4"
              style={isTop
                ? { background: 'rgba(123,47,190,0.12)', borderColor: 'rgba(123,47,190,0.4)' }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  {isTop && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full mb-1 inline-block"
                      style={{ background: 'linear-gradient(90deg,#8b5cf6,#d946ef)', color: '#fff' }}>
                      🏆 Best Weekend
                    </span>
                  )}
                  <div className="text-white font-bold text-sm">
                    {fri.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {last.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-purple-300">{totalYes}</div>
                  <div className="text-white/30 text-xs">/{n} yes</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {dates.map(dateStr => {
                  const { day, date, month } = formatDate(dateStr)
                  const { yes, no } = scoreDate(dateStr)
                  return (
                    <div key={dateStr} className="flex items-center gap-2">
                      <span className="text-white/40 text-xs w-16 shrink-0">{day} {date} {month}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${n > 0 ? (yes / n) * 100 : 0}%` }} />
                      </div>
                      <span className="text-green-400 text-xs w-4 text-right font-bold">{yes}</span>
                      <span className="text-red-400/50 text-xs w-4 text-right">{no > 0 ? `-${no}` : ''}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mb-6">
        <h3 className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">
          Who's responded ({responded.length}/{NAMES.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {NAMES.map(name => {
            const done = responded.includes(name)
            return (
              <span key={name} className="text-xs font-semibold rounded-full px-3 py-1 border"
                style={done
                  ? { background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.35)', color: '#86efac' }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
                {done ? '✓ ' : '○ '}{name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
