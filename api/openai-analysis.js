/**
 * OpenAI API 분석 프록시 서버리스 함수
 * Vercel Serverless Function
 */

export default async function handler(req, res) {
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

  // POST 요청만 허용
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { financialData, companyName } = req.body;

    // 필수 파라미터 검증
    if (!financialData || !Array.isArray(financialData) || financialData.length === 0) {
      res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'financialData array is required'
      });
      return;
    }

    // API 키 가져오기
    const apiKey = process.env.VITE_OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY || 
                   req.headers['x-openai-api-key'];

    if (!apiKey) {
      res.status(500).json({ 
        error: 'API key not configured',
        message: 'OpenAI API key is not set in environment variables'
      });
      return;
    }

    // 재무 데이터를 분석하기 쉬운 형식으로 변환
    const analysisPrompt = createAnalysisPrompt(financialData, companyName);

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 또는 gpt-4o
        messages: [
          {
            role: 'system',
            content: '당신은 재무 분석 전문가입니다. 재무 데이터를 분석하여 일반인도 쉽게 이해할 수 있도록 명확하고 친절하게 설명해주세요.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || '분석 결과를 생성할 수 없습니다.';

    res.status(200).json({
      success: true,
      analysis: analysis,
      model: data.model
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
};

/**
 * 재무 데이터를 분석 프롬프트로 변환
 */
function createAnalysisPrompt(financialData, companyName = '') {
  // 주요 계정 추출
  const balanceSheet = financialData.filter(item => item.sj_div === 'BS');
  const incomeStatement = financialData.filter(item => item.sj_div === 'IS');

  let prompt = `다음은 ${companyName || '한 회사'}의 재무 데이터입니다. 이 데이터를 분석하여 일반인도 쉽게 이해할 수 있도록 설명해주세요.\n\n`;

  // 재무상태표 주요 항목
  const totalAssets = balanceSheet.find(item => item.account_nm === '자산총계');
  const totalLiabilities = balanceSheet.find(item => item.account_nm === '부채총계');
  const totalEquity = balanceSheet.find(item => item.account_nm === '자본총계');

  if (totalAssets) {
    prompt += `\n[자산총계]\n`;
    prompt += `- 당기: ${formatAmount(totalAssets.thstrm_amount)}\n`;
    if (totalAssets.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(totalAssets.frmtrm_amount)}\n`;
    }
  }

  if (totalLiabilities) {
    prompt += `\n[부채총계]\n`;
    prompt += `- 당기: ${formatAmount(totalLiabilities.thstrm_amount)}\n`;
    if (totalLiabilities.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(totalLiabilities.frmtrm_amount)}\n`;
    }
  }

  if (totalEquity) {
    prompt += `\n[자본총계]\n`;
    prompt += `- 당기: ${formatAmount(totalEquity.thstrm_amount)}\n`;
    if (totalEquity.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(totalEquity.frmtrm_amount)}\n`;
    }
  }

  // 손익계산서 주요 항목
  const revenue = incomeStatement.find(item => item.account_nm === '매출액');
  const operatingProfit = incomeStatement.find(item => item.account_nm === '영업이익');
  const netIncome = incomeStatement.find(item => item.account_nm === '당기순이익(손실)');

  if (revenue) {
    prompt += `\n[매출액]\n`;
    prompt += `- 당기: ${formatAmount(revenue.thstrm_amount)}\n`;
    if (revenue.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(revenue.frmtrm_amount)}\n`;
    }
  }

  if (operatingProfit) {
    prompt += `\n[영업이익]\n`;
    prompt += `- 당기: ${formatAmount(operatingProfit.thstrm_amount)}\n`;
    if (operatingProfit.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(operatingProfit.frmtrm_amount)}\n`;
    }
  }

  if (netIncome) {
    prompt += `\n[당기순이익]\n`;
    prompt += `- 당기: ${formatAmount(netIncome.thstrm_amount)}\n`;
    if (netIncome.frmtrm_amount) {
      prompt += `- 전기: ${formatAmount(netIncome.frmtrm_amount)}\n`;
    }
  }

  prompt += `\n\n위 데이터를 바탕으로 다음을 포함하여 분석해주세요:\n`;
  prompt += `1. 재무 건전성 평가\n`;
  prompt += `2. 수익성 분석\n`;
  prompt += `3. 전년 대비 주요 변화점\n`;
  prompt += `4. 일반인이 이해하기 쉬운 종합 평가\n`;
  prompt += `5. 주의해야 할 사항 (있는 경우)\n\n`;
  prompt += `분석은 한국어로 작성하고, 전문 용어는 쉬운 말로 풀어서 설명해주세요.`;

  return prompt;
}

/**
 * 금액 포맷팅 (원 단위)
 */
function formatAmount(amount) {
  if (!amount) return '0원';
  const num = parseInt(amount, 10);
  if (isNaN(num)) return amount;
  
  if (num >= 1000000000000) {
    return `${(num / 1000000000000).toFixed(1)}조원`;
  } else if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억원`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만원`;
  }
  return `${num.toLocaleString()}원`;
}

