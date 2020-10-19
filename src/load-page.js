const axios = require('axios')
const cheerio = require('cheerio')
const getDb = require('./get-db')
const db = getDb('./db.json')
const getPageInfo = require('./get-page-info')

const pages = db.get('pages')
const loadPage = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data)
  const page = getPageInfo(url, $);
  pages.push(page)
    .write();
  return page;
}

module.exports = loadPage;
