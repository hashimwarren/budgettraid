// Re-export database instance and schema for easy imports
export { db } from '../db';
export * from '../db/schema';

// Example utility functions for your KidsEatFree app

import { db } from '../db';
import {
  citiesTable,
  restaurantsTable,
  dealsTable,
  cuisinesTable,
  restaurantCuisinesTable,
  tipsTable,
  flagsTable,
  type Restaurant,
  type Deal,
  type City
} from '../db/schema';
import { eq, and, asc, desc } from 'drizzle-orm';

// Get all cities
export async function getCities() {
  return await db.select().from(citiesTable).orderBy(asc(citiesTable.name));
}

// Get city by slug
export async function getCityBySlug(slug: string) {
  const [city] = await db.select().from(citiesTable).where(eq(citiesTable.slug, slug));
  return city;
}

// Get restaurants with their deals for a specific city and day
export async function getRestaurantsWithDeals(cityId: number, dayOfWeek: string) {
  return await db
    .select({
      restaurant: restaurantsTable,
      deal: dealsTable,
    })
    .from(restaurantsTable)
    .leftJoin(dealsTable, eq(restaurantsTable.id, dealsTable.restaurantId))
    .where(
      and(
        eq(restaurantsTable.cityId, cityId),
        eq(restaurantsTable.active, true),
        eq(dealsTable.dayOfWeek, dayOfWeek)
      )
    )
    .orderBy(asc(restaurantsTable.name));
}

// Get restaurant details by ID
export async function getRestaurantById(id: number) {
  const [restaurant] = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, id));
  return restaurant;
}

// Submit a tip for a restaurant
export async function submitTip(restaurantId: number, message: string, sourceUrl?: string) {
  const [tip] = await db
    .insert(tipsTable)
    .values({
      restaurantId,
      message,
      sourceUrl,
      verified: false,
    })
    .returning();
  return tip;
}

// Submit a flag for a restaurant
export async function submitFlag(restaurantId: number, reason: string) {
  const [flag] = await db
    .insert(flagsTable)
    .values({
      restaurantId,
      reason,
      resolved: false,
    })
    .returning();
  return flag;
}

// Check if a restaurant has unresolved flags
export async function hasUnresolvedFlags(restaurantId: number) {
  const flags = await db
    .select()
    .from(flagsTable)
    .where(
      and(
        eq(flagsTable.restaurantId, restaurantId),
        eq(flagsTable.resolved, false)
      )
    );
  return flags.length > 0;
}
