const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "https://www.thetimes.co.uk"
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "https://www.theguardian.com"
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk"
  },
  {
    name: "climatehome",
    address: "https://www.climatechangenews.com/",
    base: "https://www.climatechangenews.com"
  },
  {
    name: "natgeo",
    address: "https://www.nationalgeographic.com/environment/global-warming/",
    base: "https://www.nationalgeographic.com"
  },
  {
    name: "nasa",
    address: "https://climate.nasa.gov",
    base: "https://climate.nasa.gov"
  },
  {
    name: "nytimes",
    address: "https://www.nytimes.com/section/climate",
    base: "https://www.nytimes.com"
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science-environment-15874560",
    base: "https://www.bbc.com"
  },
  {
    name: "edf",
    address: "https://www.edf.org/climate",
    base: "https://www.edf.org"
  },
  {
    name: "climatechangenews",
    address: "https://www.climatechangenews.com/",
    base: "https://www.climatechangenews.com"
  },
  {
    name: "Scientific American",
    address: "https://www.scientificamerican.com/climate-change/",
    base: "https://www.scientificamerican.com/climate-change"
  },
  {
    name: "National Geographic",
    address: "https://www.nationalgeographic.com/environment/global-warming/",
    base: "https://www.nationalgeographic.com/environment/global-warming"
  },
  {
    name: "ClimateWire",
    address: "https://www.eenews.net/climatewire/",
    base: "https://www.eenews.net/climatewire"
  },
  {
    name: "Climate Reality",
    address: "https://www.climaterealityproject.org/",
    base: "https://www.climaterealityproject.org"
  },
  {
    name: "Climate Depot",
    address: "https://www.climatedepot.com/",
    base: "https://www.climatedepot.com"
  },
  {
    name: "Climate Central",
    address: "https://www.climatecentral.org/",
    base: "https://www.climatecentral.org"
  },
  {
    name: "Carbon Brief",
    address: "https://www.climatecentral.org/",
    base: "https://www.climatecentral.org"
  },
];
const articles = [];

newspapers.forEach(newspaper => {
  let { name, address, base } = newspaper;
  axios.get(address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a:contains("climate")').each((i, element) => {
        const title = $(element).text()
        const url = $(element).attr('href')
        const completeUrl = url.includes(base) ? url : base+url
        articles.push({
          title,
          url: completeUrl,
          source: name
        })
      })

    }).catch((err)=>console.log(err))
});

app.get('/', (req,res)=>{
  res.json('Welcome to my Climate Change News API')
})

app.get('/news',(req,res)=>{
  res.json(articles)
})

app.get('/news/:newspaperId', (req,res)=>{

  const newspaperId = req.params.newspaperId
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
  
  axios.get(newspaperAddress)
    .then(response=>{
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

      $('a:contains("climate")', html).each((i, element)=>{
        const title = $(element).text()
        const url = $(element).attr("href")
        const completeUrl = url.includes(newspaperBase) ? url : newspaperBase+url

        specificArticles.push({
          title,
          url: completeUrl,
          source: newspaperId
        })
      })
      res.json(specificArticles)
    }).catch((err)=>{console.log(err)})
})

app.listen(PORT, ()=>{console.log(`server running on port ${PORT}`);})