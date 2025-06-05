import fetch from 'node-fetch';

export default async function proxyImageHandler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const { url } = req.query;
  if (!url) return res.status(400).send('Parâmetro "url" é obrigatório.');

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 });
    if (!response.ok) return res.status(response.status).send('Erro ao buscar imagem');

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');

    const buffer = await response.arrayBuffer();
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error('Erro ao carregar imagem:', err);
    return res.status(500).send('Erro ao carregar imagem');
  }
}