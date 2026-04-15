export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function parseDate(dateStr: string): Date | null {
  const [day, month, year] = dateStr.split('.').map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

export function toInputDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}