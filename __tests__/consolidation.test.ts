import { mockConsolidatedDeals, mockLegacyDeals } from '@/lib/mock-data';

describe('Deal Consolidation Comparison', () => {
  it('demonstrates the problem: legacy deals show restaurants multiple times', () => {
    // Before consolidation: count unique restaurant names
    const restaurantNames = mockLegacyDeals.map(deal => deal.restaurant.name);
    const uniqueRestaurants = new Set(restaurantNames);
    
    // Buffalo Wild Wings appears 3 times, IHOP 2 times, Barberitos 2 times
    expect(restaurantNames.length).toBe(7); // Total deal records
    expect(uniqueRestaurants.size).toBe(3); // Unique restaurants
    
    // Count occurrences of each restaurant
    const bwwCount = restaurantNames.filter(name => name === 'Buffalo Wild Wings').length;
    const ihopCount = restaurantNames.filter(name => name === 'IHOP').length;
    const barberitosCount = restaurantNames.filter(name => name === 'Barberitos').length;
    
    expect(bwwCount).toBe(3); // Sunday, Monday, Wednesday
    expect(ihopCount).toBe(2); // Tuesday, Everyday
    expect(barberitosCount).toBe(2); // Tuesday, Sunday
  });

  it('demonstrates the solution: consolidated deals show each restaurant once', () => {
    // After consolidation: each restaurant appears only once
    const restaurantNames = mockConsolidatedDeals.map(deal => deal.restaurant.name);
    
    expect(restaurantNames.length).toBe(3); // One entry per restaurant
    expect(restaurantNames).toEqual(['Buffalo Wild Wings', 'IHOP', 'Barberitos']);
    
    // Buffalo Wild Wings should have 3 deals
    const bww = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'Buffalo Wild Wings');
    expect(bww?.deals.length).toBe(3);
    expect(bww?.deals.map(d => d.dayOfWeek)).toEqual(['Sunday', 'Monday', 'Wednesday']);
    
    // IHOP should have 2 deals
    const ihop = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'IHOP');
    expect(ihop?.deals.length).toBe(2);
    expect(ihop?.deals.map(d => d.dayOfWeek)).toEqual(['Tuesday', 'Everyday']);
    
    // Barberitos should have 2 deals
    const barberitos = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'Barberitos');
    expect(barberitos?.deals.length).toBe(2);
    expect(barberitos?.deals.map(d => d.dayOfWeek)).toEqual(['Tuesday', 'Sunday']);
  });

  it('preserves verified status correctly in consolidated deals', () => {
    // IHOP has one verified deal (Tuesday) and one unverified (Everyday)
    const ihop = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'IHOP');
    const tuesdayDeal = ihop?.deals.find(d => d.dayOfWeek === 'Tuesday');
    const everydayDeal = ihop?.deals.find(d => d.dayOfWeek === 'Everyday');
    
    expect(tuesdayDeal?.verified).toBe(true);
    expect(everydayDeal?.verified).toBe(false);
    
    // Barberitos has both deals verified
    const barberitos = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'Barberitos');
    expect(barberitos?.deals.every(d => d.verified)).toBe(true);
    
    // Buffalo Wild Wings has no verified deals
    const bww = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'Buffalo Wild Wings');
    expect(bww?.deals.every(d => !d.verified)).toBe(true);
  });

  it('preserves different rules for different days', () => {
    // IHOP has different rules for Tuesday vs Everyday
    const ihop = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'IHOP');
    const tuesdayRule = ihop?.deals.find(d => d.dayOfWeek === 'Tuesday')?.ruleText;
    const everydayRule = ihop?.deals.find(d => d.dayOfWeek === 'Everyday')?.ruleText;
    
    expect(tuesdayRule).toBe('Kids under 12 eat free with adult meal purchase (4-10 PM)');
    expect(everydayRule).toBe('Kids under 12 eat free every evening from 4 p.m. to 10 p.m. (dine-in only)');
    expect(tuesdayRule).not.toBe(everydayRule);
    
    // Barberitos has different rules for different days
    const barberitos = mockConsolidatedDeals.find(deal => deal.restaurant.name === 'Barberitos');
    const tuesdayBarberitosRule = barberitos?.deals.find(d => d.dayOfWeek === 'Tuesday')?.ruleText;
    const sundayBarberitosRule = barberitos?.deals.find(d => d.dayOfWeek === 'Sunday')?.ruleText;
    
    expect(tuesdayBarberitosRule).toContain('4-close');
    expect(sundayBarberitosRule).toContain('11am-2pm');
    expect(tuesdayBarberitosRule).not.toBe(sundayBarberitosRule);
  });
});