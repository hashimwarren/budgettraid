import { formatDayOfWeek, getCurrentDayOfWeek, isOpenForKidsEatFree } from '@/lib/date-utils'

describe('Date Utilities', () => {
  describe('formatDayOfWeek', () => {
    it('formats valid days correctly', () => {
      expect(formatDayOfWeek('monday')).toBe('Monday')
      expect(formatDayOfWeek('TUESDAY')).toBe('Tuesday')
      expect(formatDayOfWeek('Wednesday')).toBe('Wednesday')
    })

    it('returns original string for invalid days', () => {
      expect(formatDayOfWeek('invalid')).toBe('invalid')
      expect(formatDayOfWeek('')).toBe('')
    })
  })

  describe('getCurrentDayOfWeek', () => {
    it('returns a valid day of the week', () => {
      const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const result = getCurrentDayOfWeek()

      expect(validDays).toContain(result)
    })
  })

  describe('isOpenForKidsEatFree', () => {
    const mockDeals = [
      { dayOfWeek: 'monday' },
      { dayOfWeek: 'wednesday' },
      { dayOfWeek: 'friday' },
    ]

    it('returns true when restaurant has deals for the target day', () => {
      expect(isOpenForKidsEatFree(mockDeals, 'monday')).toBe(true)
      expect(isOpenForKidsEatFree(mockDeals, 'WEDNESDAY')).toBe(true)
    })

    it('returns false when restaurant has no deals for the target day', () => {
      expect(isOpenForKidsEatFree(mockDeals, 'tuesday')).toBe(false)
      expect(isOpenForKidsEatFree(mockDeals, 'sunday')).toBe(false)
    })

    it('handles empty deals array', () => {
      expect(isOpenForKidsEatFree([], 'monday')).toBe(false)
    })
  })
})
