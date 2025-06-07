const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const cheerios = require('cheerio');
const axios = require('axios');

app.get('/', (req, res) => {
    res.json("hello");
})

app.get('/api/data/:id', async(req, res) => {
    const { id } = req.params;

    const url = `https://auth.geeksforgeeks.org/user/${id}/`;
                
    try {
        const { data } = await axios.get(url);
        const $ = cheerios.load(data);

        const scrapedData = {};

        scrapedData["Username"] = $('div.profilePicSection_head_userHandle__oOfFy').text().trim();
        scrapedData["Institute"] = $('div.educationDetails_head_left__NkHF5 > a').text().trim();
        scrapedData["Institute Rank"] = $('div.educationDetails_head_left_userRankContainer__tyT6H b').text().trim();
        scrapedData["Coding Score"] = $('div.scoreCards_head__G_uNQ > div:nth-child(1) .scoreCard_head_left--score__oSi_x').text().trim();
        scrapedData["Problems Solved"] = $('div.scoreCards_head__G_uNQ > div:nth-child(3) .scoreCard_head_left--score__oSi_x').text().trim();
        scrapedData["Contest Rating"] = $('div.scoreCards_head__G_uNQ > div:nth-child(5) .scoreCard_head_left--score__oSi_x').text().trim();

        res.json(scrapedData);
    } catch (error) {
        console.error("Error fetching or scraping:", error.message);
        res.status(500).json({ error: "Failed to fetch or parse user profile." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`server running at ${port}`);
})

module.exports = app;