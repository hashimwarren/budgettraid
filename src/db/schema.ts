import { integer, pgTable, varchar, boolean, timestamp, text, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Cities table
export const citiesTable = pgTable("cities", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  centerLat: real("center_lat").notNull(),
  centerLng: real("center_lng").notNull(),
});

// Cuisines table
export const cuisinesTable = pgTable("cuisines", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
});

// Restaurants table
export const restaurantsTable = pgTable("restaurants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 500 }),
  lat: real(),
  lng: real(),
  cityId: integer("city_id").notNull().references(() => citiesTable.id),
  active: boolean().notNull().default(true),
});

// Restaurant-Cuisine junction table
export const restaurantCuisinesTable = pgTable("restaurant_cuisines", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id),
  cuisineId: integer("cuisine_id").notNull().references(() => cuisinesTable.id),
});

// Deals table
export const dealsTable = pgTable("deals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id),
  dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(),
  ruleText: text("rule_text"),
  verified: boolean().notNull().default(false),
  verifiedAt: timestamp("verified_at"),
});

// Tips table
export const tipsTable = pgTable("tips", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id),
  message: text().notNull(),
  sourceUrl: varchar("source_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  verified: boolean().notNull().default(false),
  verifiedAt: timestamp("verified_at"),
});

// Flags table
export const flagsTable = pgTable("flags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id),
  reason: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolved: boolean().notNull().default(false),
  resolvedAt: timestamp("resolved_at"),
});

// Relations
export const citiesRelations = relations(citiesTable, ({ many }) => ({
  restaurants: many(restaurantsTable),
}));

export const restaurantsRelations = relations(restaurantsTable, ({ one, many }) => ({
  city: one(citiesTable, {
    fields: [restaurantsTable.cityId],
    references: [citiesTable.id],
  }),
  deals: many(dealsTable),
  tips: many(tipsTable),
  flags: many(flagsTable),
  cuisines: many(restaurantCuisinesTable),
}));

export const cuisinesRelations = relations(cuisinesTable, ({ many }) => ({
  restaurants: many(restaurantCuisinesTable),
}));

export const restaurantCuisinesRelations = relations(restaurantCuisinesTable, ({ one }) => ({
  restaurant: one(restaurantsTable, {
    fields: [restaurantCuisinesTable.restaurantId],
    references: [restaurantsTable.id],
  }),
  cuisine: one(cuisinesTable, {
    fields: [restaurantCuisinesTable.cuisineId],
    references: [cuisinesTable.id],
  }),
}));

export const dealsRelations = relations(dealsTable, ({ one }) => ({
  restaurant: one(restaurantsTable, {
    fields: [dealsTable.restaurantId],
    references: [restaurantsTable.id],
  }),
}));

export const tipsRelations = relations(tipsTable, ({ one }) => ({
  restaurant: one(restaurantsTable, {
    fields: [tipsTable.restaurantId],
    references: [restaurantsTable.id],
  }),
}));

export const flagsRelations = relations(flagsTable, ({ one }) => ({
  restaurant: one(restaurantsTable, {
    fields: [flagsTable.restaurantId],
    references: [restaurantsTable.id],
  }),
}));

// Type exports for inference
export type City = typeof citiesTable.$inferSelect;
export type NewCity = typeof citiesTable.$inferInsert;

export type Cuisine = typeof cuisinesTable.$inferSelect;
export type NewCuisine = typeof cuisinesTable.$inferInsert;

export type Restaurant = typeof restaurantsTable.$inferSelect;
export type NewRestaurant = typeof restaurantsTable.$inferInsert;

export type Deal = typeof dealsTable.$inferSelect;
export type NewDeal = typeof dealsTable.$inferInsert;

export type Tip = typeof tipsTable.$inferSelect;
export type NewTip = typeof tipsTable.$inferInsert;

export type Flag = typeof flagsTable.$inferSelect;
export type NewFlag = typeof flagsTable.$inferInsert;
