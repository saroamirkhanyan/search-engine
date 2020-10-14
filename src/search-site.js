const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const { Worker } = require('worker_threads');
const isUrl = require('./is-url');
//database configuration
const getDb = require('./get-db');
const db = getDb('./db.json')


db.defaults({ pages: [] }).write()

const pages = db.get('pages');

const loadPage = require('./load-page');

async function searchPage(search_text) {
    if (isUrl(search_text)) {
        const url = search_text;
        // if url in our database return that page
        let page = pages.find({ url }).value()
        if (page) {
            page.rating += 1
            pages.write()
            return page
        };
        // else get it by scrapper
        page = await loadPage(url)
        const worker = new Worker(
            path.resolve(__dirname, './load-all-linked-pages.js'),
        );
        //give html of this page to worker
        worker.postMessage(url);
        return page;
    }
    // all results
    let results = []
    // get all words of text
    const words = search_text.split(' ');
    words.forEach(word => {
        const result = pages
            .value()
            //get that pages that have current word in title of description
            .filter(item => {
                word = word.toLowerCase();
                return item?.title?.toLowerCase().search(word) != -1 || item?.description?.toLowerCase().search(word) != -1
            });
        // merge all results with our result
        if (result) results = [...results, ...result]
    })

    if (results) return results;
    return 'result not found';
}
// test
module.exports = searchPage
