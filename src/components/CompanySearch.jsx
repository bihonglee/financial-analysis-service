import React, { useState, useEffect, useRef } from 'react';
import { searchCompany } from '../utils/corpSearch';
import './CompanySearch.css';

const CompanySearch = ({ onCompanySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // 외부 클릭 시 결과 숨기기
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchCompany(searchQuery, 10);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('검색 오류:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운스 적용
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setSearchQuery(company.corp_name);
    setShowResults(false);
    if (onCompanySelect) {
      onCompanySelect(company);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCompany(null);
    setResults([]);
    setShowResults(false);
    if (onCompanySelect) {
      onCompanySelect(null);
    }
  };

  return (
    <div className="company-search" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="회사명을 입력하세요 (예: 삼성전자)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {selectedCompany && (
          <button className="clear-button" onClick={handleClear}>
            ✕
          </button>
        )}
        {isLoading && <div className="loading-spinner" />}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((company) => (
            <div
              key={company.corp_code}
              className={`result-item ${selectedCompany?.corp_code === company.corp_code ? 'selected' : ''}`}
              onClick={() => handleSelectCompany(company)}
            >
              <div className="result-name">{company.corp_name}</div>
              {company.stock_code && (
                <div className="result-code">종목코드: {company.stock_code}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showResults && searchQuery.length > 0 && results.length === 0 && !isLoading && (
        <div className="search-results">
          <div className="no-results">검색 결과가 없습니다.</div>
        </div>
      )}

      {selectedCompany && (
        <div className="selected-company-info">
          <div className="info-label">선택된 회사:</div>
          <div className="info-content">
            <strong>{selectedCompany.corp_name}</strong>
            {selectedCompany.stock_code && (
              <span className="stock-code"> ({selectedCompany.stock_code})</span>
            )}
            <div className="corp-code">고유번호: {selectedCompany.corp_code}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;

