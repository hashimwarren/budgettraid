import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)

    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders getting started instructions', () => {
    render(<Home />)

    const instructions = screen.getByText(/Get started by editing/i)
    expect(instructions).toBeInTheDocument()
  })

  it('renders deployment link', () => {
    render(<Home />)

    const deployLink = screen.getByRole('link', { name: /deploy now/i })
    expect(deployLink).toBeInTheDocument()
    expect(deployLink).toHaveAttribute('href', expect.stringContaining('vercel.com'))
  })

  it('renders documentation link', () => {
    render(<Home />)

    const docsLink = screen.getByRole('link', { name: /read our docs/i })
    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
  })
})
