const axios = require('axios')
const cheerio = require('cheerio')


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const noLinks = ['#', 'javascript:void(0)',
    'javascript:void(0);']

db.defaults({ sites: [] })
    .write()

const sites = db.get('sites');


async function searchSite(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const title = $('title').text()
        const text = $('p').text()
        const page = { url, title, text }
        sites.push(page)
            .write()
        console.log(url + ' site added!')
        url = url.slice(0, url.length - 1)
        $('a').each((_idx, el) => {
            let link = $(el).attr('href')
            if (!link) return
            if (link[0] == '#') return
            if (link[0] == '/') link = url + link
            if (noLinks.includes(link)) return
            if (!link.startsWith('http')) return;
            searchSite(link)
        });
    }
    catch{
        console.log('Page not found !')
    }


}


searchSite('https://youtube.com')