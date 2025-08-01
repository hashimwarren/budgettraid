import { GET } from '@/app/api/cities/route'
import { getCities } from '@/lib/database'

// Mock the database function
jest.mock('@/lib/database', () => ({
  getCities: jest.fn(),
}))

describe('/api/cities', () => {
  const mockGetCities = getCities as jest.MockedFunction<typeof getCities>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns cities successfully', async () => {
    const mockCities = [
      { id: 1, name: 'Greensboro', slug: 'greensboro', centerLat: 36.0726, centerLng: -79.7920 },
      { id: 2, name: 'High Point', slug: 'high-point', centerLat: 35.9557, centerLng: -80.0053 },
    ]

    mockGetCities.mockResolvedValue(mockCities)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockCities)
    expect(mockGetCities).toHaveBeenCalledTimes(1)
  })

  it('handles database errors', async () => {
    mockGetCities.mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to fetch cities' })
    expect(mockGetCities).toHaveBeenCalledTimes(1)
  })
})
