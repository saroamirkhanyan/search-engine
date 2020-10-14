const { parentPort } = require('worker_threads');
const axios = require('axios')
const cheerio = require('cheerio');
const isUrl = require('./is-url')
const getDb = require('./get-db')
const db = getDb('./db.json');
const path = require('path');
const pages = db.get('pages');
const getPageInfo = require('./get-page-info')
const urljoin = require('url-join')
parentPort.once('message', loadAllLinkedPages);



async function loadAllLinkedPages(url) {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data);
  const hrefs = [];
  // get all hrefs
  $('a[href]').each(function (_idx, el) {
    let href = $(el).attr('href');
    if (href[0] == '/') {
      href = urljoin(url, href)
    }
    const is_url = isUrl(href);
    if (is_url && href !== url) hrefs.push(href)
  });

  for (const href of hrefs) {
    const page = pages.value().find(item => item.url == href);
    if (page) {
      page.rating += 1;
      pages.write()
      continue;
    };

    try {
      const { data: page } = await axios.get(href);
      const page_body = cheerio.load(page);
      const page_info = getPageInfo(url, page_body);
      pages.push(page_info)
        .write()
      loadAllLinkedPages(href)
    } catch {
      console.log('smth went wrong');
    }

  }
}


