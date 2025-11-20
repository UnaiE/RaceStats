import scrapingService from '../services/scrapingService.js';
import mongoose from 'mongoose';

// Connect to MongoDB
const MONGO_URI = 'mongodb://mongo:27017/racestats';

async function enrichTeamsData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Team = mongoose.model('Team', new mongoose.Schema({}, { strict: false, collection: 'teams' }));
    
    const teams = await Team.find({});
    console.log(`Found ${teams.length} teams to enrich`);

    for (const team of teams) {
      console.log(`\nScraping data for ${team.name}...`);
      
      const scrapedData = await scrapingService.scrapeTeamData(team.name);
      
      if (scrapedData) {
        // Update team with scraped data
        await Team.updateOne(
          { _id: team._id },
          {
            $set: {
              news: scrapedData.news,
              sponsors_scraped: scrapedData.sponsors,
              images_gallery: scrapedData.images,
              last_scraped: new Date()
            }
          }
        );
        
        console.log(`✅ Updated ${team.name}:`);
        console.log(`   - News: ${scrapedData.news.length}`);
        console.log(`   - Sponsors: ${scrapedData.sponsors.length}`);
        console.log(`   - Images: ${scrapedData.images.length}`);
      } else {
        console.log(`⚠️  No data found for ${team.name}`);
      }
      
      // Wait 2 seconds between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Team enrichment completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error enriching teams:', error);
    process.exit(1);
  }
}

async function enrichDriversData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Driver = mongoose.model('Driver', new mongoose.Schema({}, { strict: false, collection: 'drivers' }));
    
    const drivers = await Driver.find({}); // Get ALL drivers
    console.log(`Found ${drivers.length} drivers to enrich`);

    for (const driver of drivers) {
      const fullName = `${driver.first_name} ${driver.last_name}`;
      console.log(`\nScraping data for ${fullName}...`);
      
      const scrapedData = await scrapingService.scrapeDriverData(fullName);
      
      if (scrapedData) {
        await Driver.updateOne(
          { _id: driver._id },
          {
            $set: {
              news: scrapedData.news,
              stats_scraped: scrapedData.stats,
              images_gallery: scrapedData.images,
              videos: scrapedData.videos,
              career_highlights: scrapedData.career_highlights || [],
              wiki_info: scrapedData.wiki_info || {},
              last_scraped: new Date()
            }
          }
        );
        
        console.log(`✅ Updated ${fullName}:`);
        console.log(`   - News: ${scrapedData.news.length}`);
        console.log(`   - Stats: ${Object.keys(scrapedData.stats).length}`);
        console.log(`   - Images: ${scrapedData.images.length}`);
      } else {
        console.log(`⚠️  No data found for ${fullName}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Driver enrichment completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error enriching drivers:', error);
    process.exit(1);
  }
}

async function enrichCarsData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Car = mongoose.model('Car', new mongoose.Schema({}, { strict: false, collection: 'cars' }));
    
    const cars = await Car.find({}); // Get ALL cars
    console.log(`Found ${cars.length} cars to enrich`);

    for (const car of cars) {
      console.log(`\nScraping data for ${car.team_name} ${car.year}...`);
      
      const scrapedData = await scrapingService.scrapeCarData(car.team_name, car.year);
      
      if (scrapedData) {
        await Car.updateOne(
          { _id: car._id },
          {
            $set: {
              images_gallery: scrapedData.images,
              videos: scrapedData.videos,
              technical_specs_scraped: scrapedData.technical_specs,
              last_scraped: new Date()
            }
          }
        );
        
        console.log(`✅ Updated ${car.team_name} ${car.year}:`);
        console.log(`   - Images: ${scrapedData.images.length}`);
        console.log(`   - Videos: ${scrapedData.videos.length}`);
        console.log(`   - Specs: ${Object.keys(scrapedData.technical_specs).length}`);
      } else {
        console.log(`⚠️  No data found for ${car.team_name} ${car.year}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Car enrichment completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error enriching cars:', error);
    process.exit(1);
  }
}

// Run based on command line argument
const target = process.argv[2];

if (target === 'teams') {
  enrichTeamsData();
} else if (target === 'drivers') {
  enrichDriversData();
} else if (target === 'cars') {
  enrichCarsData();
} else {
  console.log('Usage: node enrichData.js [teams|drivers|cars]');
  process.exit(1);
}
