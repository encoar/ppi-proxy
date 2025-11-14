// api/ppi-proxy.js
// Este archivo va en: api/ppi-proxy.js

module.exports = async (req, res) => {
  // CORS headers - IMPORTANTE para que funcione desde claude.ai
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AuthorizedClient, ClientKey, ApiKey, ApiSecret');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Test endpoint para verificar que el proxy está vivo
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'OK', 
      message: 'PPI Proxy está funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  }
  
  // Manejar POST requests
  if (req.method === 'POST') {
    try {
      const { endpoint, method = 'GET', body, headers } = req.body || {};
      
      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required in body' });
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
      
      return res.status(response.status).json(data);
      
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ 
        error: error.message,
        details: 'Error al conectar con PPI API'
      });
    }
  }
  
  // Método no soportado
  return res.status(405).json({ error: 'Method not allowed' });
};
