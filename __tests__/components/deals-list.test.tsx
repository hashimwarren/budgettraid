import { render, screen, waitFor } from '@testing-library/react';
import DealsList from '@/components/deals-list';

// Mock fetch
global.fetch = jest.fn();

describe('DealsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<DealsList city="greensboro" day="Sunday" />);

    // Check for skeleton loading cards instead of text
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('shows "no deals found" when API returns empty array', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<DealsList city="greensboro" day="Monday" />);

    await waitFor(() => {
      expect(screen.getByText(/no deals found/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/no kids eat free deals available for monday in greensboro/i)).toBeInTheDocument();
  });

  it('displays deals when API returns data', async () => {
    const mockDeals = [
      {
        id: 1,
        dayOfWeek: 'Sunday',
        ruleText: 'Kids eat free with adult entrée purchase',
        verified: true,
        verifiedAt: '2024-01-01T00:00:00Z',
        restaurant: {
          id: 1,
          name: 'Chuck E. Cheese',
          websiteUrl: 'https://www.chuckecheese.com',
          lat: 36.0726,
          lng: -79.7920,
        },
        city: {
          id: 1,
          name: 'Greensboro',
          slug: 'greensboro',
        },
        cuisines: [
          {
            id: 1,
            name: 'Fast Food',
            slug: 'fast-food',
          },
        ],
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeals,
    });

    render(<DealsList city="greensboro" day="Sunday" />);

    await waitFor(() => {
      expect(screen.getByText('Chuck E. Cheese')).toBeInTheDocument();
    });

    expect(screen.getByText('Kids eat free with adult entrée purchase')).toBeInTheDocument();
    expect(screen.getByText('Fast Food')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('1 deal for Sunday in Greensboro')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<DealsList city="greensboro" day="Sunday" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading deals/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('fetches deals when city or day changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { rerender } = render(<DealsList city="greensboro" day="Sunday" />);

    expect(fetch).toHaveBeenCalledWith('/api/deals?city=greensboro&day=Sunday');

    rerender(<DealsList city="greensboro" day="Monday" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/deals?city=greensboro&day=Monday');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('fetches deals even when city or day is empty', () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<DealsList city="" day="Sunday" />);

    expect(fetch).toHaveBeenCalledWith('/api/deals?day=Sunday');
  });

  it('fetches all deals when no filters are provided', () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<DealsList />);

    expect(fetch).toHaveBeenCalledWith('/api/deals?');
  });
});
