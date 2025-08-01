import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Budget Triad Home Page', () => {
  it('renders the Budget Triad branding', () => {
    render(<Home />)
    
    expect(screen.getByText('Budget Triad')).toBeInTheDocument()
    expect(screen.getByText('Your guide to saving money in the Triad area')).toBeInTheDocument()
  })

  it('displays the Kids Eat Free card', () => {
    render(<Home />)
    
    expect(screen.getByText('🍽️ Kids Eat Free')).toBeInTheDocument()
    expect(screen.getByText('Find restaurants where kids eat free today')).toBeInTheDocument()
  })

  it('has a link to the kids eat free section', () => {
    render(<Home />)
    
    const link = screen.getByRole('link', { name: 'Browse Deals' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/kidseatfree')
  })

  it('displays coming soon sections', () => {
    render(<Home />)
    
    expect(screen.getByText('🛍️ Shopping Deals')).toBeInTheDocument()
    expect(screen.getByText('🎉 Events')).toBeInTheDocument()
    expect(screen.getAllByText('Coming Soon')).toHaveLength(2)
  })
})
