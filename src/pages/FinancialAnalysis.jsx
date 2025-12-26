import React, { useState } from 'react';
import CompanySearch from '../components/CompanySearch';
import FinancialData from '../components/FinancialData';
import FinancialCharts from '../components/FinancialCharts';
import AIAnalysis from '../components/AIAnalysis';
import './FinancialAnalysis.css';

const FinancialAnalysis = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setFinancialData(null); // 회사 변경 시 재무 데이터 초기화
  };

  const handleDataLoaded = (data) => {
    setFinancialData(data);
  };

  return (
    <div className="financial-analysis-page">
      <div className="page-header">
        <h1 className="page-title">재무 데이터 시각화 분석 서비스</h1>
        <p className="page-subtitle">
          회사명을 검색하고 재무 데이터를 조회하여 차트로 시각화하고 AI로 분석해보세요.
        </p>
      </div>

      <div className="analysis-steps">
        {/* Step 1: 회사 검색 */}
        <section className="step-section">
          <div className="step-header">
            <span className="step-number">1</span>
            <h2 className="step-title">회사 검색</h2>
          </div>
          <CompanySearch onCompanySelect={handleCompanySelect} />
        </section>

        {/* Step 2: 재무 데이터 조회 */}
        {selectedCompany && (
          <section className="step-section">
            <div className="step-header">
              <span className="step-number">2</span>
              <h2 className="step-title">재무 데이터 조회</h2>
            </div>
            <FinancialData 
              corpCode={selectedCompany.corp_code} 
              onDataLoaded={handleDataLoaded}
            />
          </section>
        )}

        {/* Step 3: 차트 시각화 */}
        {financialData && (
          <section className="step-section">
            <div className="step-header">
              <span className="step-number">3</span>
              <h2 className="step-title">데이터 시각화</h2>
            </div>
            <FinancialCharts financialData={financialData} />
          </section>
        )}

        {/* Step 4: AI 분석 */}
        {financialData && (
          <section className="step-section">
            <div className="step-header">
              <span className="step-number">4</span>
              <h2 className="step-title">AI 분석</h2>
            </div>
            <AIAnalysis 
              financialData={financialData} 
              companyName={selectedCompany?.corp_name}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalysis;

