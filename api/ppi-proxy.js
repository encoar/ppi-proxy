const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Permitir CORS desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AuthorizedClient, ClientKey, ApiKey, ApiSecret');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { endpoint, method = 'GET', body, headers } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }
    
    const url = `https://clientapi.portfoliopersonal.com${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
};
