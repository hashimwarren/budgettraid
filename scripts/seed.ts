import 'dotenv/config';
import { db } from '../src/db';
import { citiesTable, cuisinesTable, restaurantsTable, dealsTable, restaurantCuisinesTable } from '../src/db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data in reverse dependency order
    console.log('🧹 Clearing existing data...');
    await db.delete(restaurantCuisinesTable);
    await db.delete(dealsTable);
    await db.delete(restaurantsTable);
    await db.delete(cuisinesTable);
    await db.delete(citiesTable);
    console.log('✅ Existing data cleared');

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
      { name: 'Wings', slug: 'wings' },
      { name: 'Burgers', slug: 'burgers' },
      { name: 'Mediterranean', slug: 'mediterranean' },
      { name: 'BBQ', slug: 'bbq' },
    ]).returning();

    console.log('✅ Cuisines inserted');

    // Insert sample restaurants
    const greensboroCity = cities.find(c => c.slug === 'greensboro');
    const highPointCity = cities.find(c => c.slug === 'high-point');
    const winstonSalemCity = cities.find(c => c.slug === 'winston-salem');

    if (!greensboroCity || !highPointCity || !winstonSalemCity) {
      throw new Error('Required city not found');
    }

    const restaurants = await db.insert(restaurantsTable).values([
      // Greensboro
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
      {
        name: 'Cici\'s Pizza',
        websiteUrl: 'http://www.cicispizza.com/',
        lat: 36.065,
        lng: -79.82,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'East Coast Wings',
        websiteUrl: 'http://eastcoastwings.com/',
        lat: 36.03,
        lng: -79.91,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'Highway 55 Burgers, Shakes & Fries',
        websiteUrl: 'https://www.hwy55.com/',
        lat: 36.09,
        lng: -79.85,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'Pita Delite',
        websiteUrl: 'https://www.pitadelite.com/',
        lat: 36.07,
        lng: -79.83,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'Uptown Charlie\'s',
        websiteUrl: 'http://uptowncharlies.com/',
        lat: 36.1,
        lng: -79.8,
        cityId: greensboroCity.id,
        active: true,
      },
      // High Point
      {
        name: 'Odeh Mediterranean Kitchen',
        websiteUrl: 'https://www.odehsmediterraneankitchen.com/',
        lat: 35.96,
        lng: -80.01,
        cityId: highPointCity.id,
        active: true,
      },
      {
        name: 'Uncle Maddio\'s Pizza',
        websiteUrl: 'http://www.unclemaddios.com/',
        lat: 35.98,
        lng: -80.02,
        cityId: highPointCity.id,
        active: true,
      },
      // Winston-Salem
      {
        name: 'Barberitos',
        websiteUrl: 'https://restaurants.barberitos.com/nc/winston-salem/2251-cloverdale-avenue/',
        lat: 36.08,
        lng: -80.28,
        cityId: winstonSalemCity.id,
        active: true,
      },
      // Multiple Locations (using Greensboro as default)
      {
        name: 'Buffalo Wild Wings',
        websiteUrl: 'https://www.buffalowildwings.com/menu/kids/',
        lat: 36.0726,
        lng: -79.7920,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'Golden Corral',
        websiteUrl: 'http://www.goldencorral.com/',
        lat: 36.0726,
        lng: -79.7920,
        cityId: greensboroCity.id,
        active: true,
      },
      {
        name: 'Mario\'s Pizza',
        websiteUrl: 'https://mariosbigpizza.com/',
        lat: 35.9557,
        lng: -80.0053,
        cityId: highPointCity.id,
        active: true,
      },
      {
        name: 'Tickle My Ribs',
        websiteUrl: 'http://tmrbbq.com/',
        lat: 35.9557,
        lng: -80.0053,
        cityId: highPointCity.id,
        active: true,
      },
      {
        name: 'Zaxby\'s',
        websiteUrl: 'https://www.zaxbys.com/',
        lat: 36.0999,
        lng: -80.2442,
        cityId: winstonSalemCity.id,
        active: true,
      },
      {
        name: 'Chili\'s',
        websiteUrl: 'https://www.chilis.com/restaurant-specials/kids-eat-free',
        lat: 36.0726,
        lng: -79.7920,
        cityId: greensboroCity.id,
        active: true,
      },
    ]).returning();

    console.log('✅ Restaurants inserted');

    // Insert deals
    const chuckECheese = restaurants.find(r => r.name === 'Chuck E. Cheese');
    const ihop = restaurants.find(r => r.name === 'IHOP');
    const bww = restaurants.find(r => r.name === 'Buffalo Wild Wings');
    const cicis = restaurants.find(r => r.name === 'Cici\'s Pizza');
    const ecw = restaurants.find(r => r.name === 'East Coast Wings');
    const hwy55 = restaurants.find(r => r.name === 'Highway 55 Burgers, Shakes & Fries');
    const goldenCorral = restaurants.find(r => r.name === 'Golden Corral');
    const marios = restaurants.find(r => r.name === 'Mario\'s Pizza');
    const odeh = restaurants.find(r => r.name === 'Odeh Mediterranean Kitchen');
    const pitaDelite = restaurants.find(r => r.name === 'Pita Delite');
    const tmr = restaurants.find(r => r.name === 'Tickle My Ribs');
    const uncleMaddios = restaurants.find(r => r.name === 'Uncle Maddio\'s Pizza');
    const uptownCharlies = restaurants.find(r => r.name === 'Uptown Charlie\'s');
    const zaxbys = restaurants.find(r => r.name === 'Zaxby\'s');
    const barberitos = restaurants.find(r => r.name === 'Barberitos');
    const chilis = restaurants.find(r => r.name === 'Chili\'s');

    if (chuckECheese && ihop && bww && cicis && ecw && hwy55 && goldenCorral && marios && odeh && pitaDelite && tmr && uncleMaddios && uptownCharlies && zaxbys && barberitos && chilis) {
      await db.insert(dealsTable).values([
        // Original deals
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
        // New deals from Triad Moms directory
        {
          restaurantId: bww.id,
          dayOfWeek: 'Sunday',
          ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
          verified: false,
        },
        {
          restaurantId: bww.id,
          dayOfWeek: 'Monday',
          ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
          verified: false,
        },
        {
          restaurantId: bww.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids meals are 50% off when accompanied by a paying adult',
          verified: false,
        },
        {
          restaurantId: cicis.id,
          dayOfWeek: 'Everyday',
          ruleText: 'Kids eat for $5.44 (ages 4-10) or $1.29 (3 and under) from the child buffet. Drink included.',
          verified: false,
        },
        {
          restaurantId: chilis.id,
          dayOfWeek: 'Varies',
          ruleText: 'Free meal for kids 12 and under with purchase of any regular entree (My Chili\'s Rewards members)',
          verified: false,
        },
        {
          restaurantId: ecw.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids eat for free with an adult purchase of $10 or more (excluding alcohol) from 3 PM to close',
          verified: false,
        },
        {
          restaurantId: hwy55.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids eat half off with adult meal',
          verified: false,
        },
        {
          restaurantId: goldenCorral.id,
          dayOfWeek: 'Everyday',
          ruleText: 'Kids 3 and under eat free every day',
          verified: false,
        },
        {
          restaurantId: ihop.id,
          dayOfWeek: 'Everyday',
          ruleText: 'Kids under 12 eat free every evening from 4 p.m. to 10 p.m. (dine-in only)',
          verified: false,
        },
        {
          restaurantId: marios.id,
          dayOfWeek: 'Everyday',
          ruleText: 'Kids meals $5 or less',
          verified: false,
        },
        {
          restaurantId: odeh.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Free kids meal with purchase of adult entree',
          verified: false,
        },
        {
          restaurantId: pitaDelite.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids 12 and under eat free with adult entrée purchase and a drink',
          verified: false,
        },
        {
          restaurantId: tmr.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Free kids meal with purchase of an adult meal',
          verified: false,
        },
        {
          restaurantId: uncleMaddios.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids eat free from 5 PM to close',
          verified: false,
        },
        {
          restaurantId: uptownCharlies.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids eat for $2.25 with adult meal purchase',
          verified: false,
        },
        {
          restaurantId: zaxbys.id,
          dayOfWeek: 'Wednesday',
          ruleText: 'Kids eat free or for $0.99, varies by location',
          verified: false,
        },
        {
          restaurantId: barberitos.id,
          dayOfWeek: 'Tuesday',
          ruleText: '1 free meal with the purchase of 1 adult meal and drink (4-close)',
          verified: true,
          verifiedAt: new Date(),
        },
        {
          restaurantId: barberitos.id,
          dayOfWeek: 'Sunday',
          ruleText: '1 free meal with the purchase of 1 adult meal and drink (11am-2pm)',
          verified: true,
          verifiedAt: new Date(),
        },
      ]);

      console.log('✅ Deals inserted');

      // Link restaurants to cuisines
      const fastFoodCuisine = cuisines.find(c => c.slug === 'fast-food');
      const americanCuisine = cuisines.find(c => c.slug === 'american');
      const pizzaCuisine = cuisines.find(c => c.slug === 'pizza');
      const wingsCuisine = cuisines.find(c => c.slug === 'wings');
      const burgersCuisine = cuisines.find(c => c.slug === 'burgers');
      const mediterraneanCuisine = cuisines.find(c => c.slug === 'mediterranean');
      const bbqCuisine = cuisines.find(c => c.slug === 'bbq');
      const mexicanCuisine = cuisines.find(c => c.slug === 'mexican');

      if (fastFoodCuisine && americanCuisine && pizzaCuisine && wingsCuisine && burgersCuisine && mediterraneanCuisine && bbqCuisine && mexicanCuisine) {
        await db.insert(restaurantCuisinesTable).values([
          { restaurantId: chuckECheese.id, cuisineId: fastFoodCuisine.id },
          { restaurantId: ihop.id, cuisineId: americanCuisine.id },
          { restaurantId: bww.id, cuisineId: americanCuisine.id },
          { restaurantId: bww.id, cuisineId: wingsCuisine.id },
          { restaurantId: cicis.id, cuisineId: pizzaCuisine.id },
          { restaurantId: ecw.id, cuisineId: americanCuisine.id },
          { restaurantId: ecw.id, cuisineId: wingsCuisine.id },
          { restaurantId: hwy55.id, cuisineId: americanCuisine.id },
          { restaurantId: hwy55.id, cuisineId: burgersCuisine.id },
          { restaurantId: goldenCorral.id, cuisineId: americanCuisine.id },
          { restaurantId: marios.id, cuisineId: pizzaCuisine.id },
          { restaurantId: odeh.id, cuisineId: mediterraneanCuisine.id },
          { restaurantId: pitaDelite.id, cuisineId: mediterraneanCuisine.id },
          { restaurantId: tmr.id, cuisineId: bbqCuisine.id },
          { restaurantId: uncleMaddios.id, cuisineId: pizzaCuisine.id },
          { restaurantId: uptownCharlies.id, cuisineId: americanCuisine.id },
          { restaurantId: zaxbys.id, cuisineId: fastFoodCuisine.id },
          { restaurantId: barberitos.id, cuisineId: mexicanCuisine.id },
          { restaurantId: chilis.id, cuisineId: americanCuisine.id },
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
