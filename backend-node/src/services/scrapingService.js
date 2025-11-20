import axios from 'axios';
import * as cheerio from 'cheerio';

class ScrapingService {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
  }

  // Scrape team data from Wikipedia
  async scrapeTeamData(teamName) {
    try {
      // Try Wikipedia first
      const wikiName = teamName.replace(/ /g, '_');
      const wikiUrl = `https://en.wikipedia.org/wiki/${wikiName}_F1`;
      
      const teamData = {
        team_name: teamName,
        news: [],
        sponsors: [],
        images: [],
        wiki_info: {},
        achievements: []
      };

      try {
        const response = await axios.get(wikiUrl, { headers: this.headers, timeout: 10000 });
        const $ = cheerio.load(response.data);
        
        // Extract team info from infobox
        $('.infobox tr').each((i, elem) => {
          const header = $(elem).find('th').text().trim();
          const value = $(elem).find('td').text().trim();
          if (header && value) {
            teamData.wiki_info[header] = value;
          }
        });

        // Extract images
        $('.infobox img, .thumb img').slice(0, 10).each((i, elem) => {
          let imgSrc = $(elem).attr('src');
          if (imgSrc && imgSrc.startsWith('//')) {
            imgSrc = 'https:' + imgSrc;
          }
          if (imgSrc && imgSrc.includes('http')) {
            teamData.images.push(imgSrc);
          }
        });

        // Extract achievements
        $('h2, h3').each((i, elem) => {
          const text = $(elem).text().toLowerCase();
          if (text.includes('championship') || text.includes('title') || text.includes('achievement')) {
            const list = $(elem).next('ul');
            list.find('li').slice(0, 10).each((j, li) => {
              const achievement = $(li).text().trim();
              if (achievement) {
                teamData.achievements.push(achievement);
              }
            });
          }
        });

      } catch (wikiError) {
        console.log(`Wikipedia not found for ${teamName}, trying alternative sources`);
      }

      // Add mock news (real implementation would scrape from news sites)
      teamData.news = this.getMockTeamNews(teamName);

      return teamData;
    } catch (error) {
      console.error(`Error scraping team ${teamName}:`, error.message);
      return null;
    }
  }

  getMockTeamNews(teamName) {
    const newsTemplates = [
      { title: `${teamName} announces technical updates for upcoming season`, source: 'F1 News' },
      { title: `${teamName} reveals new sponsor partnership`, source: 'RacingNews365' },
      { title: `Inside ${teamName}'s strategy for championship battle`, source: 'Autosport' },
      { title: `${teamName} driver lineup confirmed for next season`, source: 'The Race' },
      { title: `${teamName} unveils new team livery`, source: 'F1 Official' }
    ];

    return newsTemplates.map((template, i) => ({
      title: template.title,
      url: `https://www.formula1.com/en/latest/article/${teamName.toLowerCase().replace(/ /g, '-')}-${i}.html`,
      description: `Latest updates and news about ${teamName}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      source: template.source
    }));
  }

  // Scrape driver data from Wikipedia
  async scrapeDriverData(driverName) {
    try {
      const wikiName = driverName.replace(/ /g, '_');
      const wikiUrl = `https://en.wikipedia.org/wiki/${wikiName}`;
      
      const driverData = {
        driver_name: driverName,
        news: [],
        stats: {},
        images: [],
        wiki_info: {},
        career_highlights: []
      };

      try {
        const response = await axios.get(wikiUrl, { headers: this.headers, timeout: 10000 });
        const $ = cheerio.load(response.data);
        
        // Extract driver info from infobox
        $('.infobox tr').each((i, elem) => {
          const header = $(elem).find('th').text().trim();
          const value = $(elem).find('td').text().trim();
          if (header && value) {
            driverData.wiki_info[header] = value;
            
            // Parse specific stats
            if (header.toLowerCase().includes('championship')) {
              driverData.stats.championships = value;
            } else if (header.toLowerCase().includes('wins') || header.toLowerCase().includes('victories')) {
              driverData.stats.race_wins = value;
            } else if (header.toLowerCase().includes('podium')) {
              driverData.stats.podiums = value;
            }
          }
        });

        // Extract images
        $('.infobox img, .thumb img').slice(0, 8).each((i, elem) => {
          let imgSrc = $(elem).attr('src');
          if (imgSrc && imgSrc.startsWith('//')) {
            imgSrc = 'https:' + imgSrc;
          }
          if (imgSrc && imgSrc.includes('http')) {
            driverData.images.push(imgSrc);
          }
        });

        // Extract career highlights
        $('h2, h3').each((i, elem) => {
          const text = $(elem).text().toLowerCase();
          if (text.includes('career') || text.includes('achievement') || text.includes('record')) {
            const list = $(elem).next('ul');
            list.find('li').slice(0, 10).each((j, li) => {
              const highlight = $(li).text().trim();
              if (highlight && highlight.length < 200) {
                driverData.career_highlights.push(highlight);
              }
            });
          }
        });

      } catch (wikiError) {
        console.log(`Wikipedia not found for ${driverName}`);
      }

      // Add mock news
      driverData.news = this.getMockDriverNews(driverName);

      return driverData;
    } catch (error) {
      console.error(`Error scraping driver ${driverName}:`, error.message);
      return null;
    }
  }

  getMockDriverNews(driverName) {
    const newsTemplates = [
      { title: `${driverName} discusses race strategy ahead of next GP`, source: 'F1 News' },
      { title: `Exclusive interview: ${driverName} on team dynamics`, source: 'Autosport' },
      { title: `${driverName} sets new personal best in qualifying`, source: 'The Race' },
      { title: `${driverName}'s performance analysis and future prospects`, source: 'RacingNews365' },
      { title: `${driverName} reveals training regime and preparation`, source: 'F1 Official' }
    ];

    return newsTemplates.map((template, i) => ({
      title: template.title,
      url: `https://www.formula1.com/en/latest/article/${driverName.toLowerCase().replace(/ /g, '-')}-${i}.html`,
      description: `Latest news and updates about ${driverName}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      source: template.source
    }));
  }

  // Scrape car images and technical data
  async scrapeCarData(teamName, year) {
    try {
      const teamSlug = teamName.toLowerCase().replace(/ /g, '-');
      const url = `https://www.formula1.com/en/teams/${teamSlug}.html`;
      
      const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      const carData = {
        team_name: teamName,
        year: year,
        images: [],
        videos: [],
        technical_specs: {}
      };

      // Extract car images
      $('.car-image img, .team-car img').each((i, elem) => {
        const imgSrc = $(elem).attr('src') || $(elem).attr('data-src');
        if (imgSrc && imgSrc.includes('http')) {
          carData.images.push(imgSrc);
        }
      });

      // Extract technical specifications
      $('.spec-item').each((i, elem) => {
        const label = $(elem).find('.spec-label').text().trim();
        const value = $(elem).find('.spec-value').text().trim();
        if (label && value) {
          carData.technical_specs[label.toLowerCase().replace(/ /g, '_')] = value;
        }
      });

      // Extract video URLs
      $('iframe[src*="youtube"], a[href*="youtube"]').slice(0, 3).each((i, elem) => {
        const videoUrl = $(elem).attr('src') || $(elem).attr('href');
        if (videoUrl) {
          carData.videos.push(videoUrl);
        }
      });

      return carData;
    } catch (error) {
      console.error(`Error scraping car data for ${teamName} ${year}:`, error.message);
      return null;
    }
  }

  // Scrape F1 news from multiple sources
  async scrapeF1News(limit = 10) {
    // Retornar noticias de ejemplo mientras el scraping se arregla
    const mockNews = [
      {
        title: 'Max Verstappen gana el Gran Premio de Las Vegas',
        url: 'https://www.formula1.com',
        description: 'El piloto neerlandés suma otra victoria en la temporada 2024.',
        image: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677245030/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
        date: new Date().toISOString(),
        source: 'Formula1.com'
      },
      {
        title: 'McLaren lidera el campeonato de constructores',
        url: 'https://www.formula1.com',
        description: 'El equipo británico se mantiene en la cima con sólido desempeño.',
        image: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/team%20logos/mclaren.jpg',
        date: new Date(Date.now() - 86400000).toISOString(),
        source: 'Formula1.com'
      },
      {
        title: 'Ferrari presenta mejoras para Abu Dhabi',
        url: 'https://www.formula1.com',
        description: 'La Scuderia busca cerrar la temporada con fuerza en el desenlace final.',
        image: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/team%20logos/ferrari.jpg',
        date: new Date(Date.now() - 172800000).toISOString(),
        source: 'Formula1.com'
      },
      {
        title: 'Lando Norris lucha por el campeonato de pilotos',
        url: 'https://www.formula1.com',
        description: 'El británico se mantiene competitivo en las últimas carreras.',
        image: 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
        date: new Date(Date.now() - 259200000).toISOString(),
        source: 'Formula1.com'
      },
      {
        title: 'Red Bull Racing celebra otro título de constructores',
        url: 'https://www.formula1.com',
        description: 'El equipo austríaco domina la temporada con actuaciones sobresalientes.',
        image: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/team%20logos/red%20bull.jpg',
        date: new Date(Date.now() - 345600000).toISOString(),
        source: 'Formula1.com'
      }
    ];
    
    return mockNews.slice(0, limit);
  }

  // Alternative: Scrape from RaceFans.net
  async scrapeRaceFansNews(limit = 10) {
    // Retornar noticias de ejemplo
    const mockNews = [
      {
        title: 'Análisis: Claves de la victoria de Verstappen en Las Vegas',
        url: 'https://www.racefans.net',
        description: 'Desmenuzamos la estrategia que llevó a Max a otra victoria.',
        image: null,
        date: new Date().toISOString(),
        source: 'RaceFans.net'
      },
      {
        title: 'Entrevista exclusiva: El futuro de la Fórmula 1',
        url: 'https://www.racefans.net',
        description: 'Conversamos con los principales protagonistas sobre el futuro del deporte.',
        image: null,
        date: new Date(Date.now() - 86400000).toISOString(),
        source: 'RaceFans.net'
      },
      {
        title: 'Comparativa técnica: Los mejores coches de 2024',
        url: 'https://www.racefans.net',
        description: 'Un análisis profundo de las innovaciones técnicas de la temporada.',
        image: null,
        date: new Date(Date.now() - 172800000).toISOString(),
        source: 'RaceFans.net'
      }
    ];
    
    return mockNews.slice(0, limit);
  }
}

export default new ScrapingService();
