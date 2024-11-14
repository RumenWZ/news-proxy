const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


const getDataWithCloudflareBypass = async (url, params) => {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    };

    const response = await axios.get(url, {
      headers: headers,
      params: params,
      timeout: 5000, 
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to bypass Cloudflare or fetch data');
  }
};

app.get('/api/news/top-headlines', async (req, res) => {
  const { country = 'us' } = req.query;
  console.log(`Fetching top headlines for country: ${country}`); // Log the request
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country, apiKey: process.env.NEWSAPI_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from NewsAPI:', error); // Log error details
    res.status(500).json({ error: 'Error fetching data from NewsAPI', details: error.message });
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


app.get('/api/cloudflare-bypass', async (req, res) => {
  const { url, params } = req.query;

  try {
    const data = await getDataWithCloudflareBypass(url, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error bypassing Cloudflare', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});