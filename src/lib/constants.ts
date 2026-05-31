export const GROOM = 'Lewis'
export const ORGANISER = 'Lewis E'

export const NAMES: string[] = [
  'Adam M', 'Adam R', 'Andy E', 'Andy M',
  'Ben T', 'Cam F', 'Cam L',
  'Dave S', 'David M',
  'Elliot E',
  'Jim L', 'Joe K', 'John M',
  'Lewis E',
  'Michael H',
  'Tom M', 'Tony H',
  'Will M', 'Zach S',
]

function generateDates(): string[] {
  const dates: string[] = []
  const start = new Date('2026-07-10')
  const end = new Date('2026-08-16')
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    if (day === 5 || day === 6 || day === 0) {
      dates.push(cur.toISOString().split('T')[0])
    }
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export const DATES: string[] = generateDates()

export type Status = 'available' | 'unavailable' | null
