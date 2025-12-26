import React, { useState } from 'react';
import axios from 'axios';
import './AIAnalysis.css';

const AIAnalysis = ({ financialData, companyName }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!financialData || financialData.length === 0) {
      setError('재무 데이터가 없습니다. 먼저 데이터를 조회해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      // 개발 환경에서는 직접 API 호출, 프로덕션에서는 서버리스 함수 사용
      const isProduction = import.meta.env.PROD;
      const apiUrl = isProduction 
        ? '/api/openai-analysis' 
        : null; // 개발 환경에서는 직접 호출

      let response;
      if (isProduction && apiUrl) {
        // 프로덕션: 서버리스 함수 사용
        response = await axios.post(apiUrl, {
          financialData,
          companyName
        });

        if (response.data.success) {
          setAnalysis(response.data.analysis);
          return;
        } else {
          throw new Error(response.data.message || '분석에 실패했습니다.');
        }
      } else {
        // 개발 환경: 직접 OpenAI API 호출
        throw new Error('DIRECT_CALL'); // 개발 환경에서는 직접 호출하도록 예외 발생
      }
    } catch (err) {
      console.error('AI 분석 오류:', err);
      
      // 개발 환경에서 직접 OpenAI API 호출
      if (err.message === 'DIRECT_CALL' || (!import.meta.env.PROD && err.response?.status === 404)) {
        try {
          const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
          if (!apiKey) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
          }

          // 프롬프트 생성
          const prompt = createAnalysisPrompt(financialData, companyName);

          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: '당신은 재무 분석 전문가입니다. 재무 데이터를 분석하여 일반인도 쉽게 이해할 수 있도록 명확하고 친절하게 설명해주세요.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 2000
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              }
            }
          );

          setAnalysis(response.data.choices[0]?.message?.content || '분석 결과를 생성할 수 없습니다.');
        } catch (directError) {
          setError(directError.response?.data?.error?.message || directError.message || 'AI 분석 중 오류가 발생했습니다.');
        }
      } else {
        setError(err.response?.data?.message || err.message || 'AI 분석 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createAnalysisPrompt = (data, name = '') => {
    const balanceSheet = data.filter(item => item.sj_div === 'BS');
    const incomeStatement = data.filter(item => item.sj_div === 'IS');

    let prompt = `다음은 ${name || '한 회사'}의 재무 데이터입니다. 이 데이터를 분석하여 일반인도 쉽게 이해할 수 있도록 설명해주세요.\n\n`;

    const totalAssets = balanceSheet.find(item => item.account_nm === '자산총계');
    const totalLiabilities = balanceSheet.find(item => item.account_nm === '부채총계');
    const totalEquity = balanceSheet.find(item => item.account_nm === '자본총계');
    const revenue = incomeStatement.find(item => item.account_nm === '매출액');
    const operatingProfit = incomeStatement.find(item => item.account_nm === '영업이익');
    const netIncome = incomeStatement.find(item => item.account_nm === '당기순이익(손실)');

    const formatAmount = (amount) => {
      if (!amount) return '0원';
      const num = parseInt(amount, 10);
      if (isNaN(num)) return amount;
      if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(1)}조원`;
      if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억원`;
      if (num >= 10000) return `${(num / 10000).toFixed(1)}만원`;
      return `${num.toLocaleString()}원`;
    };

    if (totalAssets) {
      prompt += `\n[자산총계]\n당기: ${formatAmount(totalAssets.thstrm_amount)}\n`;
      if (totalAssets.frmtrm_amount) prompt += `전기: ${formatAmount(totalAssets.frmtrm_amount)}\n`;
    }
    if (totalLiabilities) {
      prompt += `\n[부채총계]\n당기: ${formatAmount(totalLiabilities.thstrm_amount)}\n`;
      if (totalLiabilities.frmtrm_amount) prompt += `전기: ${formatAmount(totalLiabilities.frmtrm_amount)}\n`;
    }
    if (totalEquity) {
      prompt += `\n[자본총계]\n당기: ${formatAmount(totalEquity.thstrm_amount)}\n`;
      if (totalEquity.frmtrm_amount) prompt += `전기: ${formatAmount(totalEquity.frmtrm_amount)}\n`;
    }
    if (revenue) {
      prompt += `\n[매출액]\n당기: ${formatAmount(revenue.thstrm_amount)}\n`;
      if (revenue.frmtrm_amount) prompt += `전기: ${formatAmount(revenue.frmtrm_amount)}\n`;
    }
    if (operatingProfit) {
      prompt += `\n[영업이익]\n당기: ${formatAmount(operatingProfit.thstrm_amount)}\n`;
      if (operatingProfit.frmtrm_amount) prompt += `전기: ${formatAmount(operatingProfit.frmtrm_amount)}\n`;
    }
    if (netIncome) {
      prompt += `\n[당기순이익]\n당기: ${formatAmount(netIncome.thstrm_amount)}\n`;
      if (netIncome.frmtrm_amount) prompt += `전기: ${formatAmount(netIncome.frmtrm_amount)}\n`;
    }

    prompt += `\n\n위 데이터를 바탕으로 다음을 포함하여 분석해주세요:\n`;
    prompt += `1. 재무 건전성 평가\n`;
    prompt += `2. 수익성 분석\n`;
    prompt += `3. 전년 대비 주요 변화점\n`;
    prompt += `4. 일반인이 이해하기 쉬운 종합 평가\n`;
    prompt += `5. 주의해야 할 사항 (있는 경우)\n\n`;
    prompt += `분석은 한국어로 작성하고, 전문 용어는 쉬운 말로 풀어서 설명해주세요.`;

    return prompt;
  };

  if (!financialData || financialData.length === 0) {
    return (
      <div className="ai-analysis-placeholder">
        <p>재무 데이터를 먼저 조회해주세요.</p>
      </div>
    );
  }

  return (
    <div className="ai-analysis">
      <div className="analysis-header">
        <h2 className="analysis-title">AI 재무 분석</h2>
        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '분석 중...' : 'AI 분석 시작'}
        </button>
      </div>

      {error && (
        <div className="analysis-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="analysis-loading">
          <div className="loading-spinner" />
          <p>AI가 재무 데이터를 분석하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="analysis-result">
          <div className="result-header">
            <h3>분석 결과</h3>
          </div>
          <div className="result-content">
            {analysis.split('\n').map((line, index) => {
              // 제목 형식 감지 (숫자로 시작하거나 특정 패턴)
              if (line.match(/^\d+\./)) {
                return (
                  <h4 key={index} className="result-section-title">
                    {line}
                  </h4>
                );
              } else if (line.trim().length > 0) {
                return (
                  <p key={index} className="result-paragraph">
                    {line}
                  </p>
                );
              } else {
                return <br key={index} />;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;

