/**
 * 회사 검색 유틸리티 함수
 */

let corpData = null;

/**
 * corp.json 파일을 로드합니다.
 */
export const loadCorpData = async () => {
  if (corpData) {
    return corpData;
  }

  try {
    const response = await fetch('/data/corp.json');
    if (!response.ok) {
      throw new Error('회사 데이터를 불러올 수 없습니다.');
    }
    corpData = await response.json();
    return corpData;
  } catch (error) {
    console.error('회사 데이터 로드 실패:', error);
    throw error;
  }
};

/**
 * 회사명으로 회사를 검색합니다.
 * @param {string} query - 검색어 (회사명)
 * @param {number} limit - 최대 결과 개수 (기본값: 10)
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchCompany = async (query, limit = 10) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const data = await loadCorpData();
  const searchTerm = query.trim().toLowerCase();

  const results = data
    .filter(company => {
      const name = (company.corp_name || '').toLowerCase();
      const engName = (company.corp_eng_name || '').toLowerCase();
      const stockCode = String(company.stock_code || '').toLowerCase();
      
      return name.includes(searchTerm) || 
             engName.includes(searchTerm) || 
             stockCode.includes(searchTerm);
    })
    .slice(0, limit);

  return results;
};

/**
 * corp_code로 회사 정보를 조회합니다.
 * @param {string} corpCode - 회사 고유번호
 * @returns {Promise<Object|null>} 회사 정보 객체
 */
export const getCompanyByCode = async (corpCode) => {
  if (!corpCode) {
    return null;
  }

  const data = await loadCorpData();
  // corp_code를 문자열로 변환하여 비교 (JSON에서 숫자로 저장될 수 있음)
  return data.find(company => String(company.corp_code) === String(corpCode)) || null;
};

