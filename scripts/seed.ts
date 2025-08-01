import 'dotenv/config';
import { db } from '../src/db';
import { citiesTable, cuisinesTable, restaurantsTable, dealsTable, restaurantCuisinesTable } from '../src/db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Insert cities
    const cities = await db.insert(citiesTable).values([
      { name: 'Greensboro', slug: 'greensboro', centerLat: 36.0726, centerLng: -79.7920 },
      { name: 'High Point', slug: 'high-point', centerLat: 35.9557, centerLng: -80.0053 },
      { name: 'Winston-Salem', slug: 'winston-salem', centerLat: 36.0999, centerLng: -80.2442 },
      { name: 'Kernersville', slug: 'kernersville', centerLat: 36.1198, centerLng: -80.0737 },
      { name: 'Asheboro', slug: 'asheboro', centerLat: 35.7071, centerLng: -79.8136 },
    ]).returning();

    console.log('✅ Cities inserted');

    // Insert cuisines
    const cuisines = await db.insert(cuisinesTable).values([
      { name: 'American', slug: 'american' },
      { name: 'Italian', slug: 'italian' },
      { name: 'Mexican', slug: 'mexican' },
      { name: 'Chinese', slug: 'chinese' },
      { name: 'Fast Food', slug: 'fast-food' },
      { name: 'Pizza', slug: 'pizza' },
    ]).returning();

    console.log('✅ Cuisines inserted');

    // Insert sample restaurants (using Greensboro as example)
    const greensboroCity = cities.find(c => c.slug === 'greensboro');
    if (!greensboroCity) throw new Error('Greensboro city not found');

    const restaurants = await db.insert(restaurantsTable).values([
      {
        name: 'Chuck E. Cheese',
        websiteUrl: 'https://www.chuckecheese.com',
        lat: 36.0726,
        lng: -79.7920,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'IHOP',
        websiteUrl: 'https://www.ihop.com',
        lat: 36.0800,
        lng: -79.8000,
        cityId: greensboroCity.id,
        active: true,
      },
    ]).returning();

    console.log('✅ Restaurants inserted');

    // Insert deals
    const chuckECheese = restaurants.find(r => r.name === 'Chuck E. Cheese');
    const ihop = restaurants.find(r => r.name === 'IHOP');

    if (chuckECheese && ihop) {
      await db.insert(dealsTable).values([
        {
          restaurantId: chuckECheese.id,
          dayOfWeek: 'Sunday',
          ruleText: 'Kids eat free with adult entrée purchase',
          verified: true,
          verifiedAt: new Date(),
        },
        {
          restaurantId: ihop.id,
          dayOfWeek: 'Tuesday',
          ruleText: 'Kids under 12 eat free with adult meal purchase (4-10 PM)',
          verified: true,
          verifiedAt: new Date(),
        },
      ]);

      console.log('✅ Deals inserted');

      // Link restaurants to cuisines
      const fastFoodCuisine = cuisines.find(c => c.slug === 'fast-food');
      const americanCuisine = cuisines.find(c => c.slug === 'american');

      if (fastFoodCuisine && americanCuisine) {
        await db.insert(restaurantCuisinesTable).values([
          { restaurantId: chuckECheese.id, cuisineId: fastFoodCuisine.id },
          { restaurantId: ihop.id, cuisineId: americanCuisine.id },
        ]);

        console.log('✅ Restaurant-cuisine relationships inserted');
      }
    }

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run the seed function
seed().catch(console.error);
