const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/news/top-headlines', async (req, res) => {
  const { country = 'us' } = req.query;
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country, apiKey: process.env.NEWSAPI_KEY },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from NewsAPI' });
  }
});

app.get('/api/news/everything', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: { q: query, apiKey: process.env.NEWSAPI_KEY },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from NewsAPI' });
  }
});

app.get('/api/mediastack/news', async (req, res) => {
  const { country = 'bg' } = req.query;
  try {
    const response = await axios.get('http://api.mediastack.com/v1/news', {
      params: { access_key: process.env.MEDIASTACK_KEY, countries: country },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Mediastack' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});