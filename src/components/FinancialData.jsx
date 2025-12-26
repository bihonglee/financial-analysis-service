import React, { useState } from 'react';
import axios from 'axios';
import './FinancialData.css';

const FinancialData = ({ corpCode, onDataLoaded }) => {
  const [bsnsYear, setBsnsYear] = useState(new Date().getFullYear() - 1);
  const [reprtCode, setReprtCode] = useState('11011'); // 사업보고서 기본값
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  const reportTypes = [
    { code: '11013', name: '1분기보고서' },
    { code: '11012', name: '반기보고서' },
    { code: '11014', name: '3분기보고서' },
    { code: '11011', name: '사업보고서' }
  ];

  // 사업연도 옵션 생성 (2015년부터 현재년도까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2015; year <= currentYear; year++) {
    yearOptions.push(year);
  }

  const handleFetchData = async () => {
    if (!corpCode) {
      setError('회사를 먼저 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFinancialData(null);

    try {
      // 개발 환경에서는 직접 API 호출, 프로덕션에서는 서버리스 함수 사용
      const isProduction = import.meta.env.PROD;
      const apiUrl = isProduction 
        ? '/api/opendart' 
        : 'https://opendart.fss.or.kr/api/fnlttSinglAcnt.json';

      const params = {
        corp_code: corpCode,
        bsns_year: bsnsYear.toString(),
        reprt_code: reprtCode
      };

      let response;
      if (isProduction) {
        // 프로덕션: 서버리스 함수 사용
        response = await axios.get(apiUrl, { params });
      } else {
        // 개발 환경: 직접 API 호출
        const apiKey = import.meta.env.VITE_OPENDART_API_KEY;
        if (!apiKey) {
          throw new Error('OpenDart API 키가 설정되지 않았습니다. .env.local 파일을 생성하고 VITE_OPENDART_API_KEY를 설정해주세요.');
        }
        params.crtfc_key = apiKey;
        response = await axios.get(apiUrl, { params });
      }

      const data = response.data;

      if (data.status !== '000') {
        throw new Error(data.message || '데이터를 불러올 수 없습니다.');
      }

      if (!data.list || data.list.length === 0) {
        throw new Error('해당 연도와 보고서에 대한 데이터가 없습니다.');
      }

      setFinancialData(data.list);
      if (onDataLoaded) {
        onDataLoaded(data.list);
      }
    } catch (err) {
      console.error('재무 데이터 조회 오류:', err);
      setError(err.response?.data?.message || err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!corpCode) {
    return (
      <div className="financial-data-placeholder">
        <p>회사를 먼저 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="financial-data">
      <div className="data-controls">
        <div className="control-group">
          <label htmlFor="bsns-year">사업연도</label>
          <select
            id="bsns-year"
            value={bsnsYear}
            onChange={(e) => setBsnsYear(parseInt(e.target.value))}
            disabled={isLoading}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="reprt-code">보고서 유형</label>
          <select
            id="reprt-code"
            value={reprtCode}
            onChange={(e) => setReprtCode(e.target.value)}
            disabled={isLoading}
          >
            {reportTypes.map(type => (
              <option key={type.code} value={type.code}>{type.name}</option>
            ))}
          </select>
        </div>

        <button
          className="fetch-button"
          onClick={handleFetchData}
          disabled={isLoading}
        >
          {isLoading ? '조회 중...' : '재무 데이터 조회'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner-large" />
          <p>재무 데이터를 불러오는 중...</p>
        </div>
      )}

      {financialData && !isLoading && (
        <div className="data-summary">
          <div className="summary-item">
            <span className="summary-label">조회된 계정 수:</span>
            <span className="summary-value">{financialData.length}개</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">재무제표 구분:</span>
            <span className="summary-value">
              {[...new Set(financialData.map(item => item.sj_nm))].join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialData;

