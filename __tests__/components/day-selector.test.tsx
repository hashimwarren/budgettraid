import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DaySelector } from '@/components/day-selector'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('DaySelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('renders with default selection as today', () => {
    render(<DaySelector />)
    
    expect(screen.getByTestId('day-selector')).toBeInTheDocument()
    expect(screen.getByText('Select Day')).toBeInTheDocument()
    
    // Should show "Today" as default selection in the trigger
    expect(screen.getByRole('combobox')).toHaveTextContent('Today')
  })

  it('displays all days of the week when opened', () => {
    render(<DaySelector />)
    
    // Open the selector
    fireEvent.click(screen.getByRole('combobox'))
    
    expect(screen.getAllByText('Today')).toHaveLength(2) // One in trigger, one in dropdown
    expect(screen.getByText('Sunday')).toBeInTheDocument()
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Tuesday')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
    expect(screen.getByText('Thursday')).toBeInTheDocument()
    expect(screen.getByText('Friday')).toBeInTheDocument()
    expect(screen.getByText('Saturday')).toBeInTheDocument()
  })

  it('allows user to select a specific day', async () => {
    render(<DaySelector />)
    
    // Open the selector
    fireEvent.click(screen.getByRole('combobox'))
    
    // Select Friday
    fireEvent.click(screen.getByText('Friday'))
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Friday')
    })
  })

  it('persists selected day to localStorage', async () => {
    render(<DaySelector />)
    
    // Open the selector and select Monday
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Monday'))
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('selectedDay', 'Monday')
    })
  })

  it('loads previously selected day from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('Wednesday')
    
    render(<DaySelector />)
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Wednesday')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('selectedDay')
  })

  it('calls onDayChange callback when day is selected', async () => {
    const mockOnDayChange = jest.fn()
    render(<DaySelector onDayChange={mockOnDayChange} />)
    
    // Open the selector and select Saturday
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Saturday'))
    
    await waitFor(() => {
      expect(mockOnDayChange).toHaveBeenCalledWith('Saturday')
    })
  })

  it('handles Today selection correctly', async () => {
    render(<DaySelector />)
    
    // Select Monday first
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Monday'))
    
    // Then select Today
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Today'))
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Today')
      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('selectedDay', 'Today')
    })
  })
})
