import { GET } from '@/app/api/deals/route';
import { NextRequest } from 'next/server';

// Mock the database
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
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
  });

  it('returns 400 when city parameter is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals?day=Sunday');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('City and day parameters are required');
  });

  it('returns 400 when day parameter is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals?city=greensboro');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('City and day parameters are required');
  });

  it('returns 400 when both parameters are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/deals');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('City and day parameters are required');
  });
});
