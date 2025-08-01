import { GET } from '@/app/api/deals/route';
import { NextRequest } from 'next/server';

// Mock the database
const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockInnerJoin = jest.fn();
const mockWhere = jest.fn();

jest.mock('@/db', () => ({
  db: {
    select: mockSelect,
  },
}));

jest.mock('@/db/schema', () => ({
  dealsTable: { id: 'deals.id', dayOfWeek: 'deals.dayOfWeek', ruleText: 'deals.ruleText', verified: 'deals.verified', verifiedAt: 'deals.verifiedAt', restaurantId: 'deals.restaurantId' },
  restaurantsTable: { id: 'restaurants.id', name: 'restaurants.name', websiteUrl: 'restaurants.websiteUrl', lat: 'restaurants.lat', lng: 'restaurants.lng', cityId: 'restaurants.cityId', active: 'restaurants.active' },
  citiesTable: { id: 'cities.id', name: 'cities.name', slug: 'cities.slug' },
  cuisinesTable: { id: 'cuisines.id', name: 'cuisines.name', slug: 'cuisines.slug' },
  restaurantCuisinesTable: { restaurantId: 'restaurant_cuisines.restaurantId', cuisineId: 'restaurant_cuisines.cuisineId' },
}));

jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  and: jest.fn(),
}));

describe('/api/deals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up the default mock chain
    mockSelect.mockReturnValue({
      from: mockFrom.mockReturnValue({
        innerJoin: mockInnerJoin.mockReturnValue({
          innerJoin: mockInnerJoin.mockReturnValue({
            where: mockWhere.mockResolvedValue([])
          })
        })
      })
    });
  });

  it('returns empty array when no deals found', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('accepts city parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals?city=greensboro');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('accepts day parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals?day=Sunday');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('accepts both city and day parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals?city=greensboro&day=Sunday');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
