import fetch from 'node-fetch';

export default async function followersHandler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Parâmetro "user_id" é obrigatório.' });

  const apiUrl = `https://instagram-premium-api-2023.p.rapidapi.com/v2/user/followers?user_id=${encodeURIComponent(user_id)}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '4f9decdf1cmsha8e3c875cf114cfp10297fjsnf1451941f64f',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    });
    const data = await response.json();
    if (!response.ok || !data || !Array.isArray(data.followers)) {
      return res.status(500).json({ error: 'Erro ao buscar seguidores' });
    }
    const followers = data.followers.map(f => ({
      username: f.username,
      full_name: f.full_name,
      profile_pic_url: f.profile_pic_url,
      is_private: f.is_private,
      is_verified: f.is_verified,
      id: f.pk
    }));
    return res.status(200).json({ followers });
  } catch (err) {
    console.error('Erro ao buscar seguidores:', err);
    return res.status(500).json({ error: 'Erro interno ao buscar seguidores' });
  }
}