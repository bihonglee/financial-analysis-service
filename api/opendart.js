/**
 * OpenDart API 프록시 서버리스 함수
 * Vercel Serverless Function
 */

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { corp_code, bsns_year, reprt_code } = req.query;

    console.log('Request query:', { corp_code, bsns_year, reprt_code });
    console.log('Environment variables:', {
      hasViteKey: !!process.env.VITE_OPENDART_API_KEY,
      hasOpendartKey: !!process.env.OPENDART_API_KEY
    });

    // 필수 파라미터 검증
    if (!corp_code || !bsns_year || !reprt_code) {
      res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'corp_code, bsns_year, and reprt_code are required',
        received: { corp_code, bsns_year, reprt_code }
      });
      return;
    }

    // API 키 가져오기 (환경 변수 또는 요청 헤더에서)
    const apiKey = process.env.OPENDART_API_KEY || 
                   process.env.VITE_OPENDART_API_KEY || 
                   req.headers['x-opendart-api-key'];

    if (!apiKey) {
      console.error('API key not found in environment variables');
      res.status(500).json({ 
        error: 'API key not configured',
        message: 'OpenDart API key is not set in environment variables',
        envVars: Object.keys(process.env).filter(k => k.includes('OPENDART') || k.includes('OPENAI'))
      });
      return;
    }

    // OpenDart API 호출
    const url = `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?crtfc_key=${apiKey}&corp_code=${corp_code}&bsns_year=${bsns_year}&reprt_code=${reprt_code}`;
    
    console.log('Calling OpenDart API:', url.replace(apiKey, '***'));
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('OpenDart API response status:', data.status);

    // OpenDart API 에러 처리
    if (data.status !== '000') {
      console.error('OpenDart API error:', data);
      res.status(400).json({
        error: 'OpenDart API error',
        status: data.status,
        message: data.message || 'Unknown error',
        fullResponse: data
      });
      return;
    }

    // 성공 응답
    res.status(200).json(data);
  } catch (error) {
    console.error('OpenDart API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

