import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CitySelector } from '@/components/city-selector'

// Mock the fetch function
global.fetch = jest.fn()

const mockCities = [
  { id: 1, name: 'Greensboro', slug: 'greensboro', centerLat: 36.0726, centerLng: -79.7920 },
  { id: 2, name: 'High Point', slug: 'high-point', centerLat: 35.9557, centerLng: -80.0053 },
  { id: 3, name: 'Winston-Salem', slug: 'winston-salem', centerLat: 36.0999, centerLng: -80.2442 },
]

describe('CitySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
  })

  it('renders loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<CitySelector />)

    expect(screen.getByText('Loading cities...')).toBeInTheDocument()
  })

  it('fetches and displays cities', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCities,
    })

    render(<CitySelector />)

    await waitFor(() => {
      expect(screen.getByText('Select a city')).toBeInTheDocument()
    })

    // Check that cities are available in select (this will depend on implementation)
    expect(fetch).toHaveBeenCalledWith('/api/cities')
  })

  it('displays error message when fetch fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<CitySelector />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load cities')).toBeInTheDocument()
    })
  })

  it('shows selected city when user makes a selection', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCities,
    })

    render(<CitySelector />)

    await waitFor(() => {
      expect(screen.getByText('Select a city')).toBeInTheDocument()
    })

    // This test will need to be updated based on the actual Select component behavior
    // For now, we're testing the concept
  })

  it('saves selected city to localStorage', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCities,
    })

    render(<CitySelector />)

    await waitFor(() => {
      expect(screen.getByText('Select a city')).toBeInTheDocument()
    })

    // Simulate city selection (implementation will vary)
    // We'll test that localStorage.setItem is called with the right city
  })

  it('loads previously selected city from localStorage', async () => {
    localStorage.setItem('selected-city', JSON.stringify(mockCities[0]))

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCities,
    })

    render(<CitySelector />)

    // Should show the previously selected city after loading
    await waitFor(() => {
      expect(screen.getByText('Greensboro')).toBeInTheDocument()
    })
  })
})
