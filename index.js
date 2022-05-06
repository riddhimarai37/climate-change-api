// defining port that server is opened on
const PORT = 2000

// initalizing and saving packages 
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'newyorktimes',
        address: 'https://www.nytimes.com/section/climate'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    },
    {
        name: 'abc',
        address: 'https://abcnews.go.com/alerts/climate-change'
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/specials/world/cnn-climate'
    },
    {
        name: 'huffpost',
        address: 'https://www.huffpost.com/impact/topic/climate-change'
    },
    {
        name: 'usatoday',
        address: 'https://www.usatoday.com/search/?q=climate'
    },
    {
        name: 'npr',
        address: 'https://www.npr.org/tags/125938077/climate-change'
    },
    {
        name: 'politico',
        address: 'https://www.politico.com/news/climate-change'
    },
    {
        name: 'losangelestimes',
        address: 'https://www.latimes.com/environment'
    }, 
    {
        name: 'newyorkpost',
        address: 'https://nypost.com/tag/climate-change/'
    },
    {
        name: 'nbc',
        address: 'https://www.nbcnews.com/science/environment'
    },
    {
        name: 'chicagotribune',
        address: 'https://www.chicagotribune.com/topic/climate-change-topic.html'
    }
]

const articles = [] 

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data 
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        })
    }) 
})
app.get('/',(req,res) => {res.json('Welcome to my Climate Change News API')})



app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req,res) =>  {
   const newspaperId =  req.params.newspaperId

   const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
   newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
   axios.get(newspaperAddress) 
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})


// to get a message that things are running fine on server
app.listen(PORT, () => console.log('server running on PORT %d', PORT))




