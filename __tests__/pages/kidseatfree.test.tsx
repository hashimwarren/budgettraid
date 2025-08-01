import { render, screen } from '@testing-library/react'
import KidsEatFreePage from '@/app/kidseatfree/page'

// Mock the CitySelector component
jest.mock('@/components/city-selector', () => ({
  CitySelector: () => <div data-testid="city-selector">City Selector</div>
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Kids Eat Free Page', () => {
  it('renders the page title and description', () => {
    render(<KidsEatFreePage />)

    expect(screen.getByText('Kids Eat Free')).toBeInTheDocument()
    expect(screen.getByText('Find today\'s kids eat free deals in your city')).toBeInTheDocument()
  })

  it('includes the CitySelector component', () => {
    render(<KidsEatFreePage />)

    expect(screen.getByTestId('city-selector')).toBeInTheDocument()
  })

  it('has a back link to Budget Triad home', () => {
    render(<KidsEatFreePage />)

    const backLink = screen.getByRole('link', { name: /back to budget triad/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/')
  })
})
