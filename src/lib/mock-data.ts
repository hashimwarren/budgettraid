import { ConsolidatedDeal } from '@/types/deals';

// Mock data to demonstrate the consolidated deals functionality
export const mockConsolidatedDeals: ConsolidatedDeal[] = [
  {
    restaurant: {
      id: 1,
      name: 'Buffalo Wild Wings',
      websiteUrl: 'https://www.buffalowildwings.com/menu/kids/',
      lat: 36.0726,
      lng: -79.7920,
    },
    city: {
      id: 1,
      name: 'Greensboro',
      slug: 'greensboro',
    },
    cuisines: [
      { id: 1, name: 'American', slug: 'american' },
      { id: 7, name: 'Wings', slug: 'wings' },
    ],
    deals: [
      {
        id: 1,
        dayOfWeek: 'Sunday',
        ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
        verified: false,
        verifiedAt: null,
      },
      {
        id: 2,
        dayOfWeek: 'Monday',
        ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
        verified: false,
        verifiedAt: null,
      },
      {
        id: 3,
        dayOfWeek: 'Wednesday',
        ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
        verified: false,
        verifiedAt: null,
      },
    ],
  },
  {
    restaurant: {
      id: 2,
      name: 'IHOP',
      websiteUrl: 'https://www.ihop.com',
      lat: 36.0800,
      lng: -79.8000,
    },
    city: {
      id: 1,
      name: 'Greensboro',
      slug: 'greensboro',
    },
    cuisines: [
      { id: 1, name: 'American', slug: 'american' },
    ],
    deals: [
      {
        id: 4,
        dayOfWeek: 'Tuesday',
        ruleText: 'Kids under 12 eat free with adult meal purchase (4-10 PM)',
        verified: true,
        verifiedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 5,
        dayOfWeek: 'Everyday',
        ruleText: 'Kids under 12 eat free every evening from 4 p.m. to 10 p.m. (dine-in only)',
        verified: false,
        verifiedAt: null,
      },
    ],
  },
  {
    restaurant: {
      id: 10,
      name: 'Barberitos',
      websiteUrl: 'https://restaurants.barberitos.com/nc/winston-salem/2251-cloverdale-avenue/',
      lat: 36.08,
      lng: -80.28,
    },
    city: {
      id: 3,
      name: 'Winston-Salem',
      slug: 'winston-salem',
    },
    cuisines: [
      { id: 3, name: 'Mexican', slug: 'mexican' },
    ],
    deals: [
      {
        id: 6,
        dayOfWeek: 'Tuesday',
        ruleText: '1 free meal with the purchase of 1 adult meal and drink (4-close)',
        verified: true,
        verifiedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 7,
        dayOfWeek: 'Sunday',
        ruleText: '1 free meal with the purchase of 1 adult meal and drink (11am-2pm)',
        verified: true,
        verifiedAt: '2024-01-01T00:00:00Z',
      },
    ],
  },
];

// This demonstrates what the API returns BEFORE consolidation (old structure)
export const mockLegacyDeals = [
  // Buffalo Wild Wings - appears 3 times
  {
    id: 1,
    dayOfWeek: 'Sunday',
    ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
    verified: false,
    verifiedAt: null,
    restaurant: { id: 1, name: 'Buffalo Wild Wings', websiteUrl: 'https://www.buffalowildwings.com/menu/kids/', lat: 36.0726, lng: -79.7920 },
    city: { id: 1, name: 'Greensboro', slug: 'greensboro' },
    cuisines: [{ id: 1, name: 'American', slug: 'american' }, { id: 7, name: 'Wings', slug: 'wings' }],
  },
  {
    id: 2,
    dayOfWeek: 'Monday',
    ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
    verified: false,
    verifiedAt: null,
    restaurant: { id: 1, name: 'Buffalo Wild Wings', websiteUrl: 'https://www.buffalowildwings.com/menu/kids/', lat: 36.0726, lng: -79.7920 },
    city: { id: 1, name: 'Greensboro', slug: 'greensboro' },
    cuisines: [{ id: 1, name: 'American', slug: 'american' }, { id: 7, name: 'Wings', slug: 'wings' }],
  },
  {
    id: 3,
    dayOfWeek: 'Wednesday',
    ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
    verified: false,
    verifiedAt: null,
    restaurant: { id: 1, name: 'Buffalo Wild Wings', websiteUrl: 'https://www.buffalowildwings.com/menu/kids/', lat: 36.0726, lng: -79.7920 },
    city: { id: 1, name: 'Greensboro', slug: 'greensboro' },
    cuisines: [{ id: 1, name: 'American', slug: 'american' }, { id: 7, name: 'Wings', slug: 'wings' }],
  },
  // IHOP - appears 2 times
  {
    id: 4,
    dayOfWeek: 'Tuesday',
    ruleText: 'Kids under 12 eat free with adult meal purchase (4-10 PM)',
    verified: true,
    verifiedAt: '2024-01-01T00:00:00Z',
    restaurant: { id: 2, name: 'IHOP', websiteUrl: 'https://www.ihop.com', lat: 36.0800, lng: -79.8000 },
    city: { id: 1, name: 'Greensboro', slug: 'greensboro' },
    cuisines: [{ id: 1, name: 'American', slug: 'american' }],
  },
  {
    id: 5,
    dayOfWeek: 'Everyday',
    ruleText: 'Kids under 12 eat free every evening from 4 p.m. to 10 p.m. (dine-in only)',
    verified: false,
    verifiedAt: null,
    restaurant: { id: 2, name: 'IHOP', websiteUrl: 'https://www.ihop.com', lat: 36.0800, lng: -79.8000 },
    city: { id: 1, name: 'Greensboro', slug: 'greensboro' },
    cuisines: [{ id: 1, name: 'American', slug: 'american' }],
  },
  // Barberitos - appears 2 times
  {
    id: 6,
    dayOfWeek: 'Tuesday',
    ruleText: '1 free meal with the purchase of 1 adult meal and drink (4-close)',
    verified: true,
    verifiedAt: '2024-01-01T00:00:00Z',
    restaurant: { id: 10, name: 'Barberitos', websiteUrl: 'https://restaurants.barberitos.com/nc/winston-salem/2251-cloverdale-avenue/', lat: 36.08, lng: -80.28 },
    city: { id: 3, name: 'Winston-Salem', slug: 'winston-salem' },
    cuisines: [{ id: 3, name: 'Mexican', slug: 'mexican' }],
  },
  {
    id: 7,
    dayOfWeek: 'Sunday',
    ruleText: '1 free meal with the purchase of 1 adult meal and drink (11am-2pm)',
    verified: true,
    verifiedAt: '2024-01-01T00:00:00Z',
    restaurant: { id: 10, name: 'Barberitos', websiteUrl: 'https://restaurants.barberitos.com/nc/winston-salem/2251-cloverdale-avenue/', lat: 36.08, lng: -80.28 },
    city: { id: 3, name: 'Winston-Salem', slug: 'winston-salem' },
    cuisines: [{ id: 3, name: 'Mexican', slug: 'mexican' }],
  },
];