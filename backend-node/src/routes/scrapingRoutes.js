import express from 'express';
import scrapingService from '../services/scrapingService.js';

const router = express.Router();

// Get team enriched data
router.get('/scrape/team/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;
    const data = await scrapingService.scrapeTeamData(teamName);
    
    if (!data) {
      return res.status(404).json({ error: 'No data found for team' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver enriched data
router.get('/scrape/driver/:driverName', async (req, res) => {
  try {
    const { driverName } = req.params;
    const data = await scrapingService.scrapeDriverData(driverName);
    
    if (!data) {
      return res.status(404).json({ error: 'No data found for driver' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get car enriched data
router.get('/scrape/car/:teamName/:year', async (req, res) => {
  try {
    const { teamName, year } = req.params;
    const data = await scrapingService.scrapeCarData(teamName, parseInt(year));
    
    if (!data) {
      return res.status(404).json({ error: 'No data found for car' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest F1 news
router.get('/scrape/news', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = await scrapingService.scrapeF1News(limit);
    
    res.json({ news, count: news.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get RaceFans news
router.get('/scrape/news/racefans', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = await scrapingService.scrapeRaceFansNews(limit);
    
    res.json({ news, count: news.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
