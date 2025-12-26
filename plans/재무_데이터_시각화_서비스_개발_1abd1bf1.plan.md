---
name: 재무 데이터 시각화 서비스 개발
overview: React 기반 재무 데이터 시각화 및 AI 분석 서비스를 개발합니다. corp.xml을 검색 가능한 데이터베이스로 변환하고, OpenDart API로 재무 데이터를 가져와 차트로 시각화하며, OpenAI API로 재무 정보를 쉽게 분석합니다.
todos:
  - id: setup-dependencies
    content: 필요한 npm 패키지 설치 (recharts, axios, fast-xml-parser)
    status: pending
  - id: convert-xml-to-json
    content: corp.xml을 JSON으로 변환하는 스크립트 작성 및 실행
    status: pending
    dependencies:
      - setup-dependencies
  - id: create-corp-search
    content: 회사명 검색 유틸리티 함수 및 컴포넌트 구현
    status: pending
    dependencies:
      - convert-xml-to-json
  - id: setup-env-vars
    content: .env.local 파일 생성 및 환경 변수 설정
    status: pending
  - id: create-opendart-api
    content: OpenDart API 프록시 서버리스 함수 생성 (api/opendart.js)
    status: pending
    dependencies:
      - setup-env-vars
  - id: create-openai-api
    content: OpenAI 분석 API 서버리스 함수 생성 (api/openai-analysis.js)
    status: pending
    dependencies:
      - setup-env-vars
  - id: build-financial-data-component
    content: 재무 데이터 조회 컴포넌트 구현 (사업연도/보고서 선택)
    status: pending
    dependencies:
      - create-opendart-api
      - create-corp-search
  - id: build-charts-component
    content: 재무 데이터 차트 시각화 컴포넌트 구현 (recharts 사용)
    status: pending
    dependencies:
      - build-financial-data-component
  - id: build-ai-analysis-component
    content: AI 분석 컴포넌트 구현 (OpenAI API 연동)
    status: pending
    dependencies:
      - create-openai-api
      - build-financial-data-component
  - id: integrate-main-page
    content: 모든 컴포넌트를 통합한 메인 페이지 생성 및 App.jsx 업데이트
    status: pending
    dependencies:
      - build-charts-component
      - build-ai-analysis-component
  - id: add-styling
    content: CSS 스타일링 및 반응형 디자인 적용
    status: pending
    dependencies:
      - integrate-main-page
  - id: error-handling
    content: 에러 처리 및 예외 상황 처리 구현
    status: pending
    dependencies:
      - integrate-main-page
---

# 재무 데이터 시각화 분석 서비스 개발 계획

## 아키텍처 개요

```javascript
사용자 입력 (회사명 검색)
    ↓
클라이언트: corp.json 검색 → corp_code 획득
    ↓
Vercel Serverless Function: OpenDart API 호출 (CORS 우회)
    ↓
클라이언트: 재무 데이터 수신 → 차트 시각화
    ↓
Vercel Serverless Function: OpenAI API 호출 (재무 분석)
    ↓
클라이언트: AI 분석 결과 표시
```



## 구현 단계

### 1. 프로젝트 설정 및 의존성 추가

**파일**: `package.json`

- `recharts`: 차트 라이브러리
- `axios`: API 호출
- `xml2js` 또는 `fast-xml-parser`: XML 파싱 (corp.xml 변환용)

### 2. 데이터베이스 구축 (corp.xml → JSON)

**파일**: `scripts/convertCorpXml.js` (일회성 변환 스크립트)

- corp.xml을 파싱하여 JSON 형식으로 변환
- `public/data/corp.json`에 저장
- 구조: `[{corp_code, corp_name, stock_code, ...}]`

**파일**: `src/utils/corpSearch.js`

- JSON 파일 로드 및 검색 함수 구현
- 회사명으로 corp_code 검색

### 3. API 키 관리

**파일**: `.env.local` (로컬 개발용)

```javascript
VITE_OPENDART_API_KEY=a4175c2c2e63226b9037613eddbd57e75f6baf71
VITE_OPENAI_API_KEY=sk-proj-...
```

**파일**: `api/opendart.js` (Vercel Serverless Function)

- OpenDart API 프록시
- 환경 변수에서 API 키 읽기
- CORS 헤더 설정

**파일**: `api/openai-analysis.js` (Vercel Serverless Function)

- OpenAI API 프록시
- 재무 데이터를 받아 분석 요청
- 환경 변수에서 API 키 읽기

### 4. 회사 검색 컴포넌트

**파일**: `src/components/CompanySearch.jsx`

- 검색 입력 필드
- 실시간 검색 결과 표시
- 선택 시 corp_code 저장

### 5. 재무 데이터 조회 컴포넌트

**파일**: `src/components/FinancialData.jsx`

- 사업연도 선택 (드롭다운)
- 보고서 코드 선택 (1분기/반기/3분기/사업보고서)
- OpenDart API 호출
- 로딩 상태 관리

### 6. 차트 시각화 컴포넌트

**파일**: `src/components/FinancialCharts.jsx`

- 재무상태표 (BS) 차트: 자산, 부채, 자본 추이
- 손익계산서 (IS) 차트: 매출액, 영업이익, 당기순이익 추이
- recharts를 사용한 라인/바 차트
- 연도별 비교 (당기/전기/전전기)

### 7. AI 분석 컴포넌트

**파일**: `src/components/AIAnalysis.jsx`

- 재무 데이터를 OpenAI API로 전송
- 분석 결과를 사용자 친화적으로 표시
- 로딩 및 에러 처리

### 8. 메인 앱 통합

**파일**: `src/App.jsx`

- 기존 랜딩 페이지와 새 재무 분석 기능 통합
- 라우팅 또는 탭 방식으로 전환

**파일**: `src/pages/FinancialAnalysis.jsx` (새 페이지)

- 모든 컴포넌트를 통합하는 메인 페이지
- 단계별 플로우: 검색 → 데이터 조회 → 시각화 → AI 분석

### 9. 스타일링

**파일**: `src/components/FinancialCharts.css`**파일**: `src/components/CompanySearch.css`**파일**: `src/components/AIAnalysis.css`

- 모던하고 깔끔한 UI 디자인
- 반응형 레이아웃

### 10. 에러 처리 및 예외 처리

- API 호출 실패 시 사용자 친화적 메시지
- 빈 데이터 처리
- 네트워크 오류 처리
- API 키 누락 시 안내 메시지

### 11. Vercel 배포 설정

**파일**: `vercel.json` (필요시)

- Serverless Functions 라우팅 설정

**문서**: `DEPLOYMENT.md`

- Vercel 환경 변수 설정 가이드
- 배포 시 주의사항

## 주요 기술 스택

- **프론트엔드**: React 18, Vite
- **차트**: recharts
- **API 호출**: axios
- **백엔드**: Vercel Serverless Functions
- **데이터 형식**: JSON (corp.xml → corp.json)

## 보안 고려사항

- API 키는 서버리스 함수에서만 사용 (클라이언트 노출 방지)
- `.env.local`은 `.gitignore`에 포함
- Vercel 환경 변수로 프로덕션 API 키 관리

## 데이터 흐름

1. 사용자가 회사명 입력 → `corp.json`에서 검색
2. `corp_code` 획득 → 사업연도/보고서 선택