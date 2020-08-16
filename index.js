const apiKey = 'AIzaSyDXgHfwTe8ZmOkkWetV8zfYOw-rMrepIs4';
const searchEngineKey = '016075355924702325305:emqggy94lr4'
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const db = require('./database.json')

async function search(q) {
    return await customSearch.cse.list({
        auth: apiKey,
        cx: searchEngineKey,
        q,
        num: 2,
    })
}


app.get('/v1/answers', async (req, res) => {
    const { keyword } = req.query
    try {
        const response = await search(keyword)
        const answers = response?.data?.items?.map(answer => answer.title)
        res.json({
            fakeData: false,
            answers
        })
    }
    catch {
        const answers = db.filter(item => item.title.includes(keyword)).map(item => item.title).slice(0, 10)
        res.send({
            fakeData: true,
            answers
        })
    }

})

app.get('/v1/search', async (req, res) => {
    const { query } = req.query
    try {
        const response = await search(query)
        const results = response?.data?.items.map(result => ({
            title: result.title,
            link: result.link,
            description: result.snippet,
        }))
        res.json({
            fakeData: false,
            results
        })
    }
    catch {
        const results = db.filter(result => result.title.includes(query)).slice(0, 10)
        res.send({
            fakeData: true,
            results
        })
    }

})

app.listen(PORT, () => console.log("SERVER STARTED ON " + PORT))


