import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dealsTable, restaurantsTable, citiesTable, cuisinesTable, restaurantCuisinesTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ConsolidatedDeal } from '@/types/deals';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const day = searchParams.get('day');

    // Build where conditions based on provided parameters
    const conditions = [eq(restaurantsTable.active, true)];

    if (city) {
      conditions.push(eq(citiesTable.slug, city));
    }

    if (day) {
      conditions.push(eq(dealsTable.dayOfWeek, day));
    }

    // Get deals with optional filtering
    const deals = await db
      .select({
        id: dealsTable.id,
        dayOfWeek: dealsTable.dayOfWeek,
        ruleText: dealsTable.ruleText,
        verified: dealsTable.verified,
        verifiedAt: dealsTable.verifiedAt,
        restaurant: {
          id: restaurantsTable.id,
          name: restaurantsTable.name,
          websiteUrl: restaurantsTable.websiteUrl,
          lat: restaurantsTable.lat,
          lng: restaurantsTable.lng,
        },
        city: {
          id: citiesTable.id,
          name: citiesTable.name,
          slug: citiesTable.slug,
        },
      })
      .from(dealsTable)
      .innerJoin(restaurantsTable, eq(dealsTable.restaurantId, restaurantsTable.id))
      .innerJoin(citiesTable, eq(restaurantsTable.cityId, citiesTable.id))
      .where(and(...conditions));

    // Group deals by restaurant
    const restaurantMap = new Map<number, ConsolidatedDeal>();

    for (const deal of deals) {
      const restaurantId = deal.restaurant.id;
      
      if (!restaurantMap.has(restaurantId)) {
        // Get cuisines for this restaurant
        const cuisines = await db
          .select({
            id: cuisinesTable.id,
            name: cuisinesTable.name,
            slug: cuisinesTable.slug,
          })
          .from(cuisinesTable)
          .innerJoin(restaurantCuisinesTable, eq(cuisinesTable.id, restaurantCuisinesTable.cuisineId))
          .where(eq(restaurantCuisinesTable.restaurantId, restaurantId));

        // Create new consolidated deal entry
        restaurantMap.set(restaurantId, {
          restaurant: deal.restaurant,
          city: deal.city,
          cuisines,
          deals: []
        });
      }

      // Add this deal to the restaurant's deals array
      const consolidatedDeal = restaurantMap.get(restaurantId)!;
      consolidatedDeal.deals.push({
        id: deal.id,
        dayOfWeek: deal.dayOfWeek,
        ruleText: deal.ruleText,
        verified: deal.verified,
        verifiedAt: deal.verifiedAt?.toISOString() || null,
      });
    }

    // Convert map to array
    const consolidatedDeals = Array.from(restaurantMap.values());

    return NextResponse.json(consolidatedDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
