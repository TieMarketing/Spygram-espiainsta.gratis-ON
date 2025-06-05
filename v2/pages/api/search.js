import fetch from 'node-fetch';

export default async function searchHandler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Parâmetro "username" é obrigatório.' });

  const apiUrl = `https://instagram-premium-api-2023.p.rapidapi.com/v2/search/accounts?query=${encodeURIComponent(username)}`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'x-rapidapi-key': '4f9decdf1cmsha8e3c875cf114cfp10297fjsnf1451941f64f',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Erro na API' });
    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro na rota search:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}