/**
 * Format a day of the week for display
 */
export function formatDayOfWeek(day: string): string {
  const days: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }

  return days[day.toLowerCase()] || day
}

/**
 * Get the current day of the week in lowercase
 */
export function getCurrentDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = new Date()
  return days[today.getDay()]
}

/**
 * Check if a restaurant is open for kids eat free on a given day
 */
export function isOpenForKidsEatFree(deals: Array<{ dayOfWeek: string }>, targetDay: string): boolean {
  return deals.some(deal => deal.dayOfWeek.toLowerCase() === targetDay.toLowerCase())
}
