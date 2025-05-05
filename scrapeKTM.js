const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://kingteamall.com/collections/sheng-puerh-raw-tea';

async function scrapeTeas(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const teas = [];

    $('.grid-product__content').each((_, el) => {
      const name = $(el).find('.grid-product__title').text().trim();
      const price = $(el).find('.grid-product__price').first().text().trim();
      if (name && price) {
        teas.push({ name, price });
      }
    });

    console.log(teas);
  } catch (err) {
    console.error('Scraping failed:', err.message);
  }
}

scrapeTeas(url);